import Lottie from 'lottie-react';

import animationData from '../../../public/loading.json';

const LotteLoading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div
      style={{
        width: 100,
        height: 100,
      }}
    >
      <Lottie {...defaultOptions} />
    </div>
  );
};

export default LotteLoading;
