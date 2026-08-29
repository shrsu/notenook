function ActionLoader({ action }) {
  return (
    <div>
      <style>
        {`
          .action-loader-bg {
            backdrop-filter: blur(5px);
          }
          
          .action-loader {
            width: 60px;
            aspect-ratio: 2;
            --_g: no-repeat radial-gradient(circle closest-side, #FCD34D 90%, #0000);
            background: 
              var(--_g) 0%   50%,
              var(--_g) 50%  50%,
              var(--_g) 100% 50%;
            background-size: calc(100%/3) 50%;
            animation: l3 1s infinite linear;
          }
          
          @keyframes l3 {
            20% { background-position: 0%   0%, 50%  50%, 100%  50%; }
            40% { background-position: 0% 100%, 50%   0%, 100%  50%; }
            60% { background-position: 0%  50%, 50% 100%, 100%   0%; }
            80% { background-position: 0%  50%, 50%  50%, 100% 100%; }
          }
        `}
      </style>
      <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 rounded-md">
        <div className="flex flex-col items-center space-y-4 p-8 rounded-[30px] bg-stone-950 bg-opacity-90">
          <div className="action-loader"></div>
          <div className="text-yellow-500 text-xl font-bold">{action}</div>
        </div>
      </div>
    </div>
  );
}

export default ActionLoader;
