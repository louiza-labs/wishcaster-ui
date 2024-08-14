import React from "react"

const Header: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="border-b border-gray-200 py-5">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  )
}

export default Header
