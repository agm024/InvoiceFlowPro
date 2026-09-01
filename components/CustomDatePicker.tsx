'use client'

import React, { useState, useEffect, useRef } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO, setMonth, setYear } from 'date-fns'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar as CalendarIcon } from 'lucide-react'

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  minDate?: string;
  showPresets?: boolean;
}

export default function CustomDatePicker({ value, onChange, label, placeholder = 'Select date', minDate, showPresets = false }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value ? parseISO(value) : new Date())
  const [view, setView] = useState<'days' | 'months' | 'years'>('days')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      setCurrentMonth(parseISO(value))
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setView('days')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedDate = value ? parseISO(value) : null

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1">
          {view === 'days' && (
            <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 12))} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500">
              <ChevronsLeft size={16} />
            </button>
          )}
          <button type="button" onClick={() => {
            if (view === 'years') setCurrentMonth(subMonths(currentMonth, 12 * 10))
            else if (view === 'months') setCurrentMonth(subMonths(currentMonth, 12))
            else setCurrentMonth(subMonths(currentMonth, 1))
          }} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500">
            <ChevronLeft size={16} />
          </button>
        </div>
        <div className="font-semibold text-sm flex gap-1 items-center">
          {view === 'days' && (
            <>
              <span onClick={() => setView('months')} className="cursor-pointer hover:text-blue-600 transition-colors px-1 rounded">{format(currentMonth, 'MMM')}</span>
              <span onClick={() => setView('years')} className="cursor-pointer hover:text-blue-600 transition-colors px-1 rounded">{format(currentMonth, 'yyyy')}</span>
            </>
          )}
          {view === 'months' && (
             <span onClick={() => setView('years')} className="cursor-pointer hover:text-blue-600 transition-colors px-1 rounded">{format(currentMonth, 'yyyy')}</span>
          )}
          {view === 'years' && (
             <span>{format(currentMonth, 'yyyy')}</span> 
          )}
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => {
            if (view === 'years') setCurrentMonth(addMonths(currentMonth, 12 * 10))
            else if (view === 'months') setCurrentMonth(addMonths(currentMonth, 12))
            else setCurrentMonth(addMonths(currentMonth, 1))
          }} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500">
            <ChevronRight size={16} />
          </button>
          {view === 'days' && (
            <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 12))} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500">
              <ChevronsRight size={16} />
            </button>
          )}
        </div>
      </div>
    )
  }

  const renderDays = () => {
    if (view !== 'days') return null
    const days = []
    const dateFormat = 'EE'
    const startDate = startOfWeek(currentMonth)
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-xs font-medium text-zinc-500 w-8">
          {format(addDays(startDate, i), dateFormat).substring(0, 2)}
        </div>
      )
    }
    return <div className="flex justify-between mb-2">{days}</div>
  }

  const renderCells = () => {
    if (view === 'months') {
      const months = Array.from({ length: 12 }, (_, i) => setMonth(currentMonth, i))
      return (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {months.map((m, i) => (
            <div 
              key={i} 
              onClick={() => {
                setCurrentMonth(m)
                setView('days')
              }}
              className="text-center py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              {format(m, 'MMM')}
            </div>
          ))}
        </div>
      )
    }

    if (view === 'years') {
      const currentY = currentMonth.getFullYear()
      const years = Array.from({ length: 12 }, (_, i) => setYear(currentMonth, currentY - 5 + i))
      return (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {years.map((y, i) => (
            <div 
              key={i} 
              onClick={() => {
                setCurrentMonth(y)
                setView('months')
              }}
              className={`text-center py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer ${
                y.getFullYear() === currentY ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : ''
              }`}
            >
              {format(y, 'yyyy')}
            </div>
          ))}
        </div>
      )
    }

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ''

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd')
        const cloneDay = day
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
        const isCurrentMonth = isSameMonth(day, monthStart)
        
        let isDisabled = false
        if (minDate && day < parseISO(minDate)) {
          isDisabled = true
        }

        days.push(
          <div
            key={day.toString()}
            onClick={() => {
              if (!isDisabled) {
                onChange(format(cloneDay, 'yyyy-MM-dd'))
                setIsOpen(false)
              }
            }}
            className={`w-8 h-8 flex items-center justify-center text-sm rounded-md cursor-pointer transition-colors ${
              isDisabled ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed' :
              isSelected
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : isCurrentMonth
                ? 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                : 'text-zinc-400 dark:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <span>{formattedDate}</span>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div className="flex justify-between mb-1" key={day.toString()}>
          {days}
        </div>
      )
      days = []
    }
    return <div>{rows}</div>
  }

  const handleNetDays = (days: number) => {
    const baseDate = minDate ? parseISO(minDate) : new Date()
    onChange(format(addDays(baseDate, days), 'yyyy-MM-dd'))
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-xs font-semibold text-zinc-500 mb-1">{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 cursor-pointer bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors h-10 w-44"
      >
        <span className={value ? 'text-zinc-900 dark:text-zinc-100 text-sm font-semibold' : 'text-zinc-400 text-sm'}>
          {value ? format(parseISO(value), 'dd-MM-yyyy') : placeholder}
        </span>
        <CalendarIcon size={16} className="text-zinc-400" />
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[280px] bg-white dark:bg-[#0a0a0a] rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-50 p-4">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          
          {showPresets && view === 'days' && (
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-wrap gap-2 justify-center">
                <button type="button" onClick={() => handleNetDays(0)} className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">Today</button>
                <button type="button" onClick={() => handleNetDays(15)} className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">Net 15</button>
                <button type="button" onClick={() => handleNetDays(30)} className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">Net 30</button>
                <button type="button" onClick={() => handleNetDays(60)} className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">Net 60</button>
                <button type="button" onClick={() => handleNetDays(90)} className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">Net 90</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
