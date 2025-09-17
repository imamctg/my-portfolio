'use client'
const ReferralLinkBox = ({ label, url }: { label: string; url: string }) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    alert('Copied to clipboard!')
  }

  return (
    <div className='bg-white p-4 rounded-lg shadow flex justify-between items-center'>
      <div>
        <p className='text-sm font-semibold text-gray-600'>{label}</p>
        <p className='text-blue-600 text-sm break-all'>{url}</p>
      </div>
      <button
        onClick={handleCopy}
        className='bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700'
      >
        Copy
      </button>
    </div>
  )
}

export default ReferralLinkBox
