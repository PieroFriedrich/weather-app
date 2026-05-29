export function WeatherSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col min-[850px]:flex-row items-stretch gap-4">
        {/* Current weather card skeleton */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl w-full max-w-sm sm:max-w-none min-[850px]:w-1/2 min-[850px]:shrink-0 animate-pulse">
          <div className="flex items-center justify-between mb-1">
            <div className="h-3 w-28 bg-white/20 rounded-full" />
            <div className="flex gap-2">
              <div className="h-5 w-5 bg-white/20 rounded-full" />
              <div className="h-5 w-5 bg-white/20 rounded-full" />
            </div>
          </div>
          <div className="flex items-start justify-between mb-6 mt-3">
            <div>
              <div className="h-20 w-36 bg-white/20 rounded-2xl mb-2" />
              <div className="h-3 w-24 bg-white/15 rounded-full mb-1.5" />
              <div className="h-3 w-32 bg-white/10 rounded-full" />
            </div>
            <div className="h-9 w-20 bg-white/15 rounded-xl mt-2" />
          </div>
          <div className="h-16 w-16 bg-white/15 rounded-2xl mb-6" />
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-4">
                <div className="h-2.5 w-12 bg-white/20 rounded-full mb-3" />
                <div className="h-7 w-10 bg-white/20 rounded-lg" />
              </div>
            ))}
            <div className="bg-white/10 rounded-2xl p-4 col-span-3 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-2.5 w-12 bg-white/20 rounded-full" />
                  <div className="h-5 w-14 bg-white/20 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Forecast strip skeleton */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl w-full animate-pulse flex flex-col justify-between gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-8 bg-white/20 rounded-full shrink-0" />
              <div className="h-6 w-6 bg-white/15 rounded-full shrink-0" />
              <div className="h-3 w-7 bg-white/15 rounded-full shrink-0" />
              <div className="flex-1 h-3 bg-white/10 rounded-full" />
              <div className="h-3 w-7 bg-white/20 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Hourly chart skeleton */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl px-4 pt-4 pb-3 shadow-2xl animate-pulse">
        <div className="h-2.5 w-20 bg-white/20 rounded-full mb-3" />
        <div className="h-20 w-full bg-white/10 rounded-2xl" />
      </div>

      {/* UV index card skeleton */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl animate-pulse">
        <div className="h-3 w-16 bg-white/20 rounded-full mb-4" />
        <div className="h-3 w-full bg-white/10 rounded-full" />
      </div>
    </div>
  );
}
