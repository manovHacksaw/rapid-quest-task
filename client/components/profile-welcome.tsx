export function ProfileWelcome() {
  return (
    <div className="flex-1 flex items-center justify-center whatsapp-chat-bg">
      <div className="text-center text-[#8696A0] max-w-md px-8">
        <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#2A3942] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#8696A0]" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-light text-[#E9EDEF] mb-4">Profile</h2>
        <p className="text-[#8696A0] text-sm leading-relaxed">
          Manage your profile information and settings
        </p>
      </div>
    </div>
  )
}
