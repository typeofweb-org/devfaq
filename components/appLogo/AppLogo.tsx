import './appLogo.scss';

const AppLogo = ({ fill = '#ffffff' }) => {
  return (
    <div className="app-logo">
      <div className="scaling-svg-container" style={{ height: '100%' }}>
        <svg
          className="scaling-svg"
          width="472px"
          height="104px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 472 104"
        >
          <g fill="none" fillRule="evenodd">
            <path style={{ fill: 'transparent !important;' }} d="M-10-10h124v124H-10z" />
            <path
              style={{ fill }}
              d="M78 52c0 3-2 5-5 5H21L0 78V6c0-3 3-6 6-6h67c3 0 5 3 5 6v46zM51 15l-2-3-4-2-4-1c-4 0-7 1-9 4l-2 3-1 3v1h7v-1c0-1 1-3 5-3 1 0 3 0 3 3 0 1 0 2-2 3l-3 3c-2 0-3 1-3 3l-1 7h8v-5l1-1 2-2c2-1 6-4 6-8l-1-4zm-8 25l-4-2-3 2a4 4 0 0 0 0 6l3 1 4-1 1-3-1-3z"
            />
            <path
              style={{ fill }}
              d="M87 21v39s0 7-6 7H21v11c0 3 2 5 5 5h57l21 21V26c0-3-3-5-5-5H87zm100 6V11h-56v74h18V60h30V44h-30V27h38zm46 39l13 8c-7 7-14 13-26 13-16 0-29-12-31-28-2-18 13-35 31-35 20 0 32 19 29 38h-44c3 6 8 10 15 10 5 0 10-2 13-6zm-13-27c-8 0-15 6-15 11h29c0-6-7-11-14-11zm98-12h-39v17h30v16h-30v25h-17V11h56v16zm57 58l-5-10h-36l-5 10h-20l37-74h14l35 74h-20zm-33-25h21l-11-23-10 23zm130 16l-13 13-7-8a39 39 0 0 1-20 6 39 39 0 1 1 32-18l8 7zm-40-6l7-2-8-8 12-13 9 9 2-8a22 22 0 1 0-22 22z"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default AppLogo;
