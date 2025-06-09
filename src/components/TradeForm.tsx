
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TradeFormProps {
  onSubmit: (trade: {
    date: string;
    time: string;
    amount: number;
    type: 'profit' | 'loss';
    summary: string;
  }) => void;
  onClose: () => void;
  initialDate?: Date;
}

export const TradeForm: React.FC<TradeFormProps> = ({ onSubmit, onClose, initialDate }) => {
  const [date, setDate] = useState<Date>(initialDate || new Date());
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'profit' | 'loss'>('profit');
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !summary) return;

    onSubmit({
      date: format(date, 'yyyy-MM-dd'),
      time,
      amount: parseFloat(amount),
      type,
      summary
    });

    // Reset form
    setAmount('');
    setSummary('');
    setTime(format(new Date(), 'HH:mm'));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Add Trade Entry
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-slate-200">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-slate-600 bg-slate-700 text-white hover:bg-slate-600",
                    !date && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className="bg-slate-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Trade Type */}
          <div className="space-y-2">
            <Label className="text-slate-200">Trade Type</Label>
            <RadioGroup value={type} onValueChange={(value: 'profit' | 'loss') => setType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="profit" id="profit" className="border-green-500 text-green-500" />
                <Label htmlFor="profit" className="text-green-400 font-medium">Profit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="loss" id="loss" className="border-red-500 text-red-500" />
                <Label htmlFor="loss" className="text-red-400 font-medium">Loss</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-200">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-slate-200">Trade Summary</Label>
            <Textarea
              id="summary"
              placeholder="Enter trade details, strategy, notes..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white resize-none"
              rows={3}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!amount || !summary}
            >
              Add Trade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
