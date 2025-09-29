import Lottie from 'lottie-react';

import animationData from '../../../public/loading.json';

const LottieLoading = () => {
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
        width: 60,
        height: 20,
      }}
    >
      <Lottie {...defaultOptions} />
    </div>
  );
};

export default LottieLoading;
