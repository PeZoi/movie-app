'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AVATAR_DEFAULT } from '@/constants/constants';
import { IMAGE_TMDB_ORIGINAL } from '@/constants/env';
import { cn } from '@/lib/utils';
import { ActorType } from '@/types/actor-type';
import Link from 'next/link';
import React, { useState } from 'react';

interface ActorListProps {
  actors: ActorType[];
  className?: string;
}

export default function ActorList({ actors, className }: ActorListProps) {
  const [actorFallbackMap, setActorFallbackMap] = useState<Record<number, boolean>>({});
  return (
    <>
      {actors.map((actor) => {
        const shouldUseFallback = actorFallbackMap[actor.actor_id] || !actor.profile_path;
        const avatarSrc = shouldUseFallback ? AVATAR_DEFAULT : `${IMAGE_TMDB_ORIGINAL}/${actor.profile_path}`;

        return (
          <Link
            href={'/actor/' + actor._id}
            className={cn('flex flex-col items-center justify-center gap-4', className)}
            key={actor.actor_id}
          >
            <Avatar className="size-20">
              <AvatarImage
                src={avatarSrc}
                className="object-cover hover:opacity-80"
                onError={() =>
                  setActorFallbackMap((prev) => ({
                    ...prev,
                    [actor.actor_id]: true,
                  }))
                }
              />
            </Avatar>
            <p className="text-sm text-wrap text-center text-white hover:text-primary-color">{actor.name}</p>
          </Link>
        );
      })}
    </>
  );
}
