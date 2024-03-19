import { BrandName } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

const LogoComponent: React.FC<LogoProps> = ({ className, width, height }) => {
    return (
        <div className={`logo`}>
            <Image
                src="/JabalEximCropped.png"
                alt={BrandName}

                width={width}
                className={cn('invert dark:invert-0', className)}
                height={height}
            />
        </div>
    );
};

export default LogoComponent;