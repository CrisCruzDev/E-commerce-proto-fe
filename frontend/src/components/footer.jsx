const Footer = () => {
  return (
    <footer className='bg-black/92 py-15'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:flex md:justify-between md:items-center'>
        <p className='text-gray-400 text-sm'>
          &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
        <div className='mt-4 md:mt-0'>
          {/* You can add social media icons or other links here later */}
          {/* For now, we'll keep it simple to match the theme */}
        </div>
      </div>
    </footer>
  )
}
export default Footer
