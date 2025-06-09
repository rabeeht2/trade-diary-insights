
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Plus, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { TradeForm } from '@/components/TradeForm';
import { DayDetailModal } from '@/components/DayDetailModal';
import { TradeCalendar } from '@/components/TradeCalendar';

export interface Trade {
  id: string;
  date: string;
  time: string;
  amount: number;
  type: 'profit' | 'loss';
  summary: string;
}

const Index = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Load trades from localStorage on component mount
  useEffect(() => {
    const savedTrades = localStorage.getItem('tradingData');
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
  }, []);

  // Save trades to localStorage whenever trades change
  useEffect(() => {
    localStorage.setItem('tradingData', JSON.stringify(trades));
  }, [trades]);

  const addTrade = (trade: Omit<Trade, 'id'>) => {
    const newTrade: Trade = {
      ...trade,
      id: Date.now().toString()
    };
    setTrades(prev => [...prev, newTrade]);
    setShowTradeForm(false);
  };

  const updateTrade = (updatedTrade: Trade) => {
    setTrades(prev => prev.map(trade => trade.id === updatedTrade.id ? updatedTrade : trade));
  };

  const deleteTrade = (tradeId: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== tradeId));
  };

  const getDayTotal = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayTrades = trades.filter(trade => trade.date === dateStr);
    return dayTrades.reduce((sum, trade) => {
      return sum + (trade.type === 'profit' ? trade.amount : -trade.amount);
    }, 0);
  };

  const getMonthTotal = (date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    return trades.reduce((sum, trade) => {
      const tradeDate = parseISO(trade.date);
      if (tradeDate >= monthStart && tradeDate <= monthEnd) {
        return sum + (trade.type === 'profit' ? trade.amount : -trade.amount);
      }
      return sum;
    }, 0);
  };

  const getTotalProfitLoss = () => {
    return trades.reduce((sum, trade) => {
      return sum + (trade.type === 'profit' ? trade.amount : -trade.amount);
    }, 0);
  };

  const monthTotal = getMonthTotal(currentDate);
  const totalPL = getTotalProfitLoss();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Trading Dashboard</h1>
          <p className="text-slate-400">Professional Trading Profit & Loss Tracker</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${totalPL.toFixed(2)}
              </div>
              <Badge 
                variant={totalPL >= 0 ? "default" : "destructive"}
                className={totalPL >= 0 ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {totalPL >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {totalPL >= 0 ? 'Profit' : 'Loss'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">This Month</CardTitle>
              <CalendarIcon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${monthTotal.toFixed(2)}
              </div>
              <p className="text-xs text-slate-400">
                {format(currentDate, 'MMMM yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total Trades</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{trades.length}</div>
              <p className="text-xs text-slate-400">
                All time trades
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Trading Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TradeCalendar
                trades={trades}
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setShowDayDetail(true);
                }}
                onMonthChange={setCurrentDate}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setShowTradeForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Trade
              </Button>
              
              {selectedDate && (
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h3 className="text-white font-medium mb-2">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <div className="text-lg font-bold text-white">
                    Day Total: ${getDayTotal(selectedDate).toFixed(2)}
                  </div>
                  <Button 
                    onClick={() => setShowDayDetail(true)}
                    variant="outline"
                    className="mt-2 border-slate-600 text-slate-200 hover:bg-slate-700"
                  >
                    View Day Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showTradeForm && (
        <TradeForm
          onSubmit={addTrade}
          onClose={() => setShowTradeForm(false)}
          initialDate={selectedDate}
        />
      )}

      {showDayDetail && (
        <DayDetailModal
          date={selectedDate}
          trades={trades.filter(trade => trade.date === format(selectedDate, 'yyyy-MM-dd'))}
          onClose={() => setShowDayDetail(false)}
          onUpdateTrade={updateTrade}
          onDeleteTrade={deleteTrade}
        />
      )}
    </div>
  );
};

export default Index;
