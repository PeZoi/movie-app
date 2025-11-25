import { Play } from 'lucide-react';
import Link from 'next/link';
import React, { Fragment } from 'react';

export default function EpisodeList() {
  return (
    <div className="grid grid-cols-8 gap-4 mt-4">
      {Array.from({ length: 25 }).map((_, index) => (
        <Fragment key={index}>
          <Link
            href={'#'}
            className="flex justify-center items-center gap-2 bg-[#282B3A] rounded-sm h-[50px] hover:text-primary-color transition-all font-medium"
          >
            <Play size={10} strokeWidth={3.5} />
            <span className="text-base">Tập {index + 1}</span>
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
