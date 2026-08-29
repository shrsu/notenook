import logo from "../../assets/logo.png";

function HomePageLoader() {
  return (
    <div>
      <style>
        {`
        .loader {
          aspect-ratio: 1;
          display: grid;
        }

        .loader::before,
        .loader::after {
          will-change: transform;
          content: "";
          grid-area: 1/1;
          --c: no-repeat radial-gradient(farthest-side, #ffee00 92%, #00000000);
          background: var(--c) 50% 0, var(--c) 50% 100%, var(--c) 100% 50%, var(--c) 0 50%;
          background-size: 12px 12px;
          animation: l12 1s infinite;
        }

        .loader::before {
          margin: 4px;
          filter: hue-rotate(45deg);
          background-size: 8px 8px;
          animation-timing-function: linear;
        }

        @keyframes l12 {
          100% {
            transform: rotate(0.5turn);
          }
        }
        `}
      </style>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <img src={logo} alt="logo" className="w-24 md:w-28 mb-12" />
        <div className="loader w-16 md:w-20" aria-label="Loading"></div>
      </div>
    </div>
  );
}

export default HomePageLoader;
