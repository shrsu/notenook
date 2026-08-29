function Loader({ action }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
      <style>
        {`
          .custom-loader {
            width: 50px;
            height: 50px;
            --c: radial-gradient(farthest-side, #FFFF00 92%, #0000);
            background: var(--c) 50% 0,
                        var(--c) 50% 100%, 
                        var(--c) 100% 50%, 
                        var(--c) 0 50%;
            background-size: 10px 10px;
            background-repeat: no-repeat;
            animation: s8 1s infinite;
            position: relative;
          }

          .custom-loader::before {
            content: "";
            position: absolute;
            inset: 0;
            margin: 3px;
            background: repeating-conic-gradient(#0000 0 35deg, #FFFF00 0 90deg);
            -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 3px), #000 0);
            border-radius: 50%;
          }

          @keyframes s8 {
            100% {
              transform: rotate(.5turn);
            }
          }
        `}
      </style>
      <div className="flex flex-col items-center space-y-4 p-8 rounded-[30px] bg-opacity-90">
        <div className="custom-loader"></div>
        <div className="text-yellow-500 text-xl font-bold">{action}</div>
      </div>
    </div>
  );
}

export default Loader;
