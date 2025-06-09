
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Save, X, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Trade } from '@/pages/Index';

interface DayDetailModalProps {
  date: Date;
  trades: Trade[];
  onClose: () => void;
  onUpdateTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  date,
  trades,
  onClose,
  onUpdateTrade,
  onDeleteTrade
}) => {
  const [editingTrade, setEditingTrade] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Trade>>({});

  const dayTotal = trades.reduce((sum, trade) => {
    return sum + (trade.type === 'profit' ? trade.amount : -trade.amount);
  }, 0);

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade.id);
    setEditForm(trade);
  };

  const handleSave = () => {
    if (editingTrade && editForm) {
      onUpdateTrade(editForm as Trade);
      setEditingTrade(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingTrade(null);
    setEditForm({});
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {format(date, 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
          <div className="flex items-center gap-4">
            <Badge 
              variant={dayTotal >= 0 ? "default" : "destructive"}
              className={`text-lg px-3 py-1 ${dayTotal >= 0 ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              {dayTotal >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              ${dayTotal.toFixed(2)}
            </Badge>
            <span className="text-slate-400">{trades.length} trades</span>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {trades.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No trades recorded for this day
            </div>
          ) : (
            trades.map((trade) => (
              <Card key={trade.id} className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4">
                  {editingTrade === trade.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label className="text-slate-200">Time</Label>
                          <Input
                            type="time"
                            value={editForm.time || ''}
                            onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-slate-200">Amount</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={editForm.amount || ''}
                            onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-slate-200">Summary</Label>
                        <Textarea
                          value={editForm.summary || ''}
                          onChange={(e) => setEditForm({...editForm, summary: e.target.value})}
                          className="bg-slate-600 border-slate-500 text-white"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} size="sm" variant="outline" className="border-slate-500 text-slate-200">
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock className="w-4 h-4" />
                            {trade.time}
                          </div>
                          <Badge 
                            variant={trade.type === 'profit' ? "default" : "destructive"}
                            className={trade.type === 'profit' ? "bg-green-600" : ""}
                          >
                            {trade.type === 'profit' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            ${trade.amount.toFixed(2)}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleEdit(trade)} 
                            size="sm" 
                            variant="outline"
                            className="border-slate-500 text-slate-200 hover:bg-slate-600"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            onClick={() => onDeleteTrade(trade.id)} 
                            size="sm" 
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm bg-slate-600/50 p-2 rounded">
                        {trade.summary}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
