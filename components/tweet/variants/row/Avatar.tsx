import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface CastAvatarProps {
  author: any
  categoryLabel: any
}

const Header = ({ author, categoryLabel }: CastAvatarProps) => {
  if (!author) return <div />
  return (
    <>
      <Avatar className="absolute left-2 top-2 size-5 rounded-full border p-0.5 shadow-sm">
        <AvatarImage
          src={"/social-account-logos/twitter-logo-black.png"}
          alt={"twitter"}
        />
      </Avatar>
      <div className="absolute right-0 top-0 flex  flex-col items-start rounded bg-slate-200 px-2 py-1 text-xs font-semibold">
        <div>{categoryLabel}</div>
      </div>
    </>
  )
}

export default Header
