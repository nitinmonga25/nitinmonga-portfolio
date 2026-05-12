import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import sharp from 'sharp';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function computeEntropy(pixels: Buffer, total: number): number {
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < pixels.length; i++) histogram[pixels[i]]++;
  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (!histogram[i]) continue;
    const p = histogram[i] / total;
    entropy -= p * Math.log2(p);
  }
  return Math.round(entropy * 100) / 100;
}

async function detectBlur(img: sharp.Sharp): Promise<number> {
  try {
    const kernel = [0, -1, 0, -1, 4, -1, 0, -1, 0];
    const { data } = await img.clone().greyscale()
      .convolve({ width: 3, height: 3, kernel })
      .raw().toBuffer({ resolveWithObject: true });
    const arr = Array.from(data as Uint8Array);
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
    return Math.min(100, Math.round(variance / 50));
  } catch { return 70; }
}

async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const apiKey    = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const folder    = 'nitinmonga/ui-analyzer';
  const timestamp = Math.round(Date.now() / 1000);
  const paramStr  = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(paramStr + apiSecret).digest('hex');

  const form = new FormData();
  form.append('file', new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' }), 'ui.jpg');
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('signature', signature);
  form.append('folder', folder);

  const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form });
  const data = await res.json() as { secure_url?: string; error?: { message: string } };
  if (!data.secure_url) throw new Error(data.error?.message ?? 'Cloudinary upload failed');
  return data.secure_url;
}

export async function POST(req: Request) {
  try {
    // Rate limit: 5 analyses per IP per 24h
    const hdrs   = headers();
    const rawIp  = hdrs.get('x-forwarded-for') || hdrs.get('x-real-ip') || '127.0.0.1';
    const ip     = rawIp.split(',')[0].trim();
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count  = await prisma.uIAnalysis.count({ where: { ipHash, createdAt: { gte: cutoff } } });
    if (count >= 5) {
      return NextResponse.json({ ok: false, error: 'rate_limit', message: 'You have used 5 free analyses today. Come back tomorrow.' }, { status: 429 });
    }

    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json({ ok: false, error: 'Invalid file type. Upload a JPEG, PNG, or WebP image.' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    const buffer   = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height || metadata.width < 400 || metadata.height < 400) {
      return NextResponse.json({ ok: false, error: 'Image must be at least 400×400 pixels for accurate analysis.' }, { status: 400 });
    }

    const resized = sharp(buffer).rotate().resize(1400, 1400, { fit: 'inside', withoutEnlargement: true });
    const stats   = await resized.clone().stats();
    const luminance = stats.channels[0].mean / 255;
    const contrast  = stats.channels[0].stdev / 128;

    const { data: grayData, info } = await resized.clone().greyscale().raw().toBuffer({ resolveWithObject: true });
    const entropy  = computeEntropy(grayData, info.width * info.height);
    const blurScore = await detectBlur(resized);

    const processedBuffer = await resized.clone().jpeg({ quality: 92 }).toBuffer();
    const base64   = processedBuffer.toString('base64');
    const imageUrl = await uploadToCloudinary(processedBuffer);

    return NextResponse.json({
      ok: true,
      base64, imageUrl, ipHash,
      width:  info.width,
      height: info.height,
      entropy, luminance, contrast, blurScore,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Processing failed';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
