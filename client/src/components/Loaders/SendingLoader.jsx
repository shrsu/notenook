function SendingLoader() {
  return (
    <div>
      <style>
        {`
          .sending-loader {
            width: 32px;
            aspect-ratio: 1;
            display: grid;
            border: 4px solid transparent;
            border-radius: 50%;
            border-right-color: #fdd835; /* Yellow color */
            animation: spin 1s infinite linear;
          }

          .sending-loader::before,
          .sending-loader::after {
            content: "";
            grid-area: 1/1;
            margin: 2px;
            border: inherit;
            border-radius: 50%;
            animation: spin 2s infinite;
          }

          .sending-loader::after {
            margin: 8px;
            animation-duration: 3s;
          }

          @keyframes spin {
            100% {
              transform: rotate(1turn);
            }
          }
        `}
      </style>

      <div className="sending-loader"></div>
    </div>
  );
}

export default SendingLoader;
