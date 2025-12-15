import { EpisodeCurrent } from '@/app/movie/watch/[slug]/watch-movie';
import { EpisodeType } from '@/types/movie-type';
import { Play } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';

interface EpisodeListProps {
  episodes: EpisodeType[];
  setEpisodeCurrent: (episode: EpisodeCurrent) => void;
}

export default function EpisodeList({ episodes, setEpisodeCurrent }: EpisodeListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { slug } = useParams();

  return (
    <div className="grid grid-cols-8 gap-4 mt-4">
      {episodes[0]?.server_data?.map((episode) => (
        <Fragment key={episode._id}>
          <div
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setEpisodeCurrent({ link_embed: episode.link_embed, episode: episode.name });
              const params = new URLSearchParams(searchParams.toString());
              params.set('ep', episode.name);
              router.replace(`/movie/watch/${slug}?${params.toString()}`, { scroll: false });
            }}
            className={`flex justify-center items-center gap-2 bg-[#282B3A] rounded-sm h-[50px] hover:opacity-80 transition-all font-medium cursor-pointer ${searchParams.get('ep') === episode.name ? 'text-black bg-primary-color' : ''}`}
          >
            <Play size={10} strokeWidth={3.5} />
            <span className="text-base">Tập {episode.name}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
