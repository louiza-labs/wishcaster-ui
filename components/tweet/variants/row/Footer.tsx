"use client"

interface TweetFooterProps {
  showToggle: boolean
  text: string
}

const TweetFooter = ({ showToggle, text }: TweetFooterProps) => {
  return (
    <>
      {showToggle && (
        <div className="border-t p-4 md:p-6">
          <div className="grid gap-4">
            <div>
              <h4 className="text-sm font-medium">Full Post</h4>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {text}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TweetFooter
