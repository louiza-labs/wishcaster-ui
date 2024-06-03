export function generateWhimsicalErrorMessages(is404 = false) {
  let messages
  if (is404) {
    messages = [
      "These aren't the droids you're looking for. 🌌",
      "Houston, we have a problem... this page doesn't exist!",
      "I'm sorry, Dave. I'm afraid I can't find that page.",
      "One does not simply walk into a non-existent page.",
      "No soup for you!",
      "Winter is coming, but this page is not.",
      "I've got a bad feeling about this... No page detected!",
      "May the Force be with you, because this page is not.",
      "In the vast galaxy of the Internet, this is not the page you are looking for.",
      "You're gonna need a bigger boat... to find this missing page.",
      "I am Groot... which means I can't find your page.",
      "Yer a wizard, Harry! But even magic can't conjure this page.",
      "What's in the box?! Definitely not this page, sadly.",
      "Life finds a way, but we couldn't find this page.",
      "I feel the need—the need for... the correct URL!",
      "They may take our lives, but they’ll never take... this missing page!",
      "We're not in Kansas anymore. We are, however, missing this page.",
      "The truth is out there... but this page certainly is not.",
      "Hold onto your butts, because this page is missing.",
      "There's no place like home... and apparently no place like this page either.",
    ]
  } else {
    messages = [
      "I'm sorry, Dave. I'm afraid I can't find those casts.",
      "One does not simply walk into Mordor, or find these casts.",
      "No soup for you!",
      "Winter is coming, but these casts are not.",
      "These are not the droids you are looking for.",
      "You're gonna need a bigger boat... to find these casts.",
      "Yer a wizard, Harry! But even you can't find these casts.",
      "What's in the box?! Not the casts, sadly.",
      "I feel the need—the need for... finding those missing casts!",
      "Hold onto your butts, because these casts are missing.",
    ]
  }
  return messages[Math.floor(Math.random() * messages.length)]
}
