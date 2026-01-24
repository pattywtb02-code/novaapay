import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBanking } from '@/hooks/useBanking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Smartphone, Globe, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

const SettingsView = () => {
  const { user, signOut } = useAuth();
  const { profile } = useBanking();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    transactions: true,
    marketing: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    biometric: true,
    loginAlerts: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-foreground">Settings</h2>

      {/* Profile Section */}
      <div className="stats-card">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Profile Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input defaultValue={profile?.full_name ?? 'Robert Stork'} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={user?.email ?? 'robert@vault.bank'} disabled />
          </div>
          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input defaultValue={profile?.account_number ?? '****7842'} disabled />
          </div>
          <div className="space-y-2">
            <Label>Routing Number</Label>
            <Input defaultValue={profile?.routing_number ?? '****1234'} disabled />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="stats-card">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Get push notifications on your device</p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Transaction Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified for every transaction</p>
            </div>
            <Switch
              checked={notifications.transactions}
              onCheckedChange={(checked) => setNotifications({ ...notifications, transactions: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing</p>
              <p className="text-sm text-muted-foreground">Receive promotional offers</p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="stats-card">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Security</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add extra layer of security</p>
            </div>
            <Switch
              checked={security.twoFactor}
              onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Biometric Login</p>
              <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
            </div>
            <Switch
              checked={security.biometric}
              onCheckedChange={(checked) => setSecurity({ ...security, biometric: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Login Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified of new logins</p>
            </div>
            <Switch
              checked={security.loginAlerts}
              onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSave}>Save Changes</Button>
        <Button variant="outline" onClick={signOut}>Sign Out</Button>
      </div>
    </div>
  );
};

export default SettingsView;
