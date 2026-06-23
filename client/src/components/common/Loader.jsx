import { RiLoader4Line } from 'react-icons/ri';

export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-accent animate-spin" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-cyan animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      </div>
    </div>
  );
}

export function LoaderSmall() {
  return (
    <RiLoader4Line className="w-5 h-5 animate-spin text-white" />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-white/10" />
        <div className="flex-1">
          <div className="h-4 bg-white/10 rounded w-32 mb-2" />
          <div className="h-3 bg-white/5 rounded w-20" />
        </div>
        <div className="h-6 bg-white/10 rounded-full w-20" />
      </div>
      {/* Content */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-3/4" />
      </div>
      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-white/5">
        <div className="h-8 bg-white/5 rounded-lg w-16" />
        <div className="h-8 bg-white/5 rounded-lg w-16" />
        <div className="h-8 bg-white/5 rounded-lg w-16" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default Loader;
