'use client'

import { useEffect, useState } from 'react'

export default function LocalTime({ date }: { date: Date | string }) {
  const [formatted, setFormatted] = useState('')

  useEffect(() => {
    if (date) {
      setFormatted(new Date(date).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }))
    }
  }, [date])

  if (!formatted) {
    return <span className="opacity-0">{new Date(date).toLocaleString()}</span>
  }

  return <span>{formatted}</span>
}

