'use client';
import Image from 'next/image';

interface DeviceMockupProps {
  type: 'macbook' | 'iphone';
  screenshot: string;
  alt?: string;
  className?: string;
}

export function DeviceMockup({
  type,
  screenshot,
  alt = 'Device screenshot',
  className = '',
}: DeviceMockupProps) {
  if (type === 'macbook') {
    return <MacbookMockup screenshot={screenshot} alt={alt} className={className} />;
  }
  return <IphoneMockup screenshot={screenshot} alt={alt} className={className} />;
}

function MacbookMockup({
  screenshot,
  alt,
  className,
}: Omit<DeviceMockupProps, 'type'>) {
  return (
    <div className={`inline-block ${className}`}>
      {/* Screen */}
      <div className="relative rounded-t-xl border-[8px] border-bg-elevated bg-bg-elevated shadow-2xl">
        {/* Camera notch */}
        <div className="absolute top-0 left-1/2 z-10 h-[6px] w-[60px] -translate-x-1/2 rounded-b-lg bg-bg-secondary">
          <div className="absolute top-[1px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-text-muted/30" />
        </div>
        {/* Screen content */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-black">
          <Image
            src={screenshot}
            alt={alt ?? 'MacBook screenshot'}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      {/* Bottom bar / hinge */}
      <div className="relative mx-auto h-[14px] w-[110%] max-w-full rounded-b-2xl bg-gradient-to-b from-border to-bg-elevated">
        {/* Indent notch */}
        <div className="absolute bottom-0 left-1/2 h-[4px] w-[80px] -translate-x-1/2 rounded-t-lg bg-border" />
      </div>
      {/* Base */}
      <div className="mx-auto h-[4px] w-[40%] rounded-b-lg bg-border/50" />
    </div>
  );
}

function IphoneMockup({
  screenshot,
  alt,
  className,
}: Omit<DeviceMockupProps, 'type'>) {
  return (
    <div className={`inline-block ${className}`}>
      <div className="relative rounded-[36px] border-[6px] border-bg-elevated bg-bg-elevated p-[2px] shadow-2xl">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-[10px] left-1/2 z-10 h-[22px] w-[80px] -translate-x-1/2 rounded-full bg-black" />

        {/* Side button (right) */}
        <div className="absolute -right-[8px] top-[80px] h-[40px] w-[3px] rounded-r bg-bg-elevated" />
        {/* Volume buttons (left) */}
        <div className="absolute -left-[8px] top-[60px] h-[24px] w-[3px] rounded-l bg-bg-elevated" />
        <div className="absolute -left-[8px] top-[92px] h-[24px] w-[3px] rounded-l bg-bg-elevated" />

        {/* Screen content */}
        <div className="relative aspect-[9/19.5] w-[180px] overflow-hidden rounded-[30px] bg-black sm:w-[220px]">
          <Image
            src={screenshot}
            alt={alt ?? 'iPhone screenshot'}
            fill
            className="object-cover object-top"
            sizes="220px"
          />
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-[6px] left-1/2 h-[4px] w-[100px] -translate-x-1/2 rounded-full bg-text-muted/20" />
      </div>
    </div>
  );
}
