
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import type { Trade } from '@/pages/Index';

interface TradeCalendarProps {
  trades: Trade[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}

export const TradeCalendar: React.FC<TradeCalendarProps> = ({
  trades,
  selectedDate,
  onDateSelect,
  onMonthChange
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the first day of the week to start the calendar grid
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());

  // Get all days to display (including prev/next month days)
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayData = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayTrades = trades.filter(trade => trade.date === dateStr);
    const total = dayTrades.reduce((sum, trade) => {
      return sum + (trade.type === 'profit' ? trade.amount : -trade.amount);
    }, 0);
    return { trades: dayTrades, total };
  };

  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange(newMonth);
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={handlePrevMonth}
          variant="outline" 
          size="sm"
          className="border-slate-600 text-slate-200 hover:bg-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button 
          onClick={handleNextMonth}
          variant="outline" 
          size="sm"
          className="border-slate-600 text-slate-200 hover:bg-slate-700"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date) => {
          const dayData = getDayData(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={`
                relative p-1 h-16 text-xs rounded-lg transition-all hover:bg-slate-700/50
                ${isCurrentMonth ? 'text-white' : 'text-slate-500'}
                ${isSelected ? 'ring-2 ring-blue-500 bg-slate-700' : ''}
                ${isToday ? 'bg-slate-600/50' : ''}
                ${dayData.trades.length > 0 ? 'border-2' : 'border'}
                ${dayData.total > 0 ? 'border-green-500' : dayData.total < 0 ? 'border-red-500' : 'border-slate-600'}
              `}
            >
              <div className="flex flex-col h-full">
                <span className={`font-medium ${isToday ? 'text-blue-400' : ''}`}>
                  {format(date, 'd')}
                </span>
                {dayData.trades.length > 0 && (
                  <div className="flex-1 flex flex-col justify-center items-center">
                    <div className={`text-xs font-bold ${dayData.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${Math.abs(dayData.total).toFixed(0)}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {dayData.trades.length} trade{dayData.trades.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
