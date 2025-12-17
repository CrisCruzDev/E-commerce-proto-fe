const Footer = () => {
  return (
    <footer className='flex flex-col md:flex-row bg-[#262626] py-5 px-6 md:py-[40px] md:px-[120px] font-bebas gap-10 md:gap-0'>
      {/* Main Text Section */}
      <div className='flex flex-col gap-[10px] md:gap-[20px] flex-1'>
        <h1 className='text-4xl sm:text-5xl md:text-[67px] text-teal transform scale-y-120 origin-left tracking-tight'>
          Concept store designed for portfolio showcasing.
        </h1>
        <h3 className='text-xl md:text-[24px] text-yellow transform scale-y-120 origin-left tracking-tight'>
          created by: criscruzdev
        </h3>
      </div>

      {/* Contact Section */}
      <div className='flex items-end md:justify-end'>
        <h3 className='flex gap-1 text-base md:text-[18px] text-link break-all'>
          <p>Email me:</p>
          <p className='font-gothic tracking-tighter text-yellow'>
            criscrosscruz@gmail.com
          </p>
        </h3>
      </div>
    </footer>
  );
};

export default Footer;
