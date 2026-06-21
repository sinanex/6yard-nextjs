      case 'settings':
        return (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center bg-white p-4 md:p-6 rounded-lg shadow-sm border border-brand-surface-normal">
              <div>
                <h2 className="font-h text-base font-bold text-brand-on-surface uppercase tracking-tight">Global Settings</h2>
                <p className="text-sm text-gray-500 text-brand-on-surface-variant opacity-60 mt-1">Manage store delivery times, fees, and admin credentials</p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Delivery Settings */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-surface-normal">
                <h3 className="font-h text-lg font-bold text-brand-on-surface mb-6 flex items-center gap-2">
                  <Package size={20} className="text-brand-primary" /> Delivery Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-sans text-sm font-bold text-brand-on-surface">Processing Time (Days)</h4>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-brand-on-surface-variant opacity-60 mb-1">From</label>
                        <input
                          type="number"
                          value={settings.processingTimeFrom}
                          onChange={(e) => setSettings({...settings, processingTimeFrom: Number(e.target.value)})}
                          className="w-full px-3 py-2 bg-brand-surface rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none"
                          min="0"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-brand-on-surface-variant opacity-60 mb-1">To</label>
                        <input
                          type="number"
                          value={settings.processingTimeTo}
                          onChange={(e) => setSettings({...settings, processingTimeTo: Number(e.target.value)})}
                          className="w-full px-3 py-2 bg-brand-surface rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-sans text-sm font-bold text-brand-on-surface">Delivery Time (Days)</h4>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-brand-on-surface-variant opacity-60 mb-1">From</label>
                        <input
                          type="number"
                          value={settings.deliveryTimeFrom}
                          onChange={(e) => setSettings({...settings, deliveryTimeFrom: Number(e.target.value)})}
                          className="w-full px-3 py-2 bg-brand-surface rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none"
                          min="0"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-brand-on-surface-variant opacity-60 mb-1">To</label>
                        <input
                          type="number"
                          value={settings.deliveryTimeTo}
                          onChange={(e) => setSettings({...settings, deliveryTimeTo: Number(e.target.value)})}
                          className="w-full px-3 py-2 bg-brand-surface rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <h4 className="font-sans text-sm font-bold text-brand-on-surface">Cash on Delivery (COD) Amount</h4>
                    <div>
                      <label className="block text-xs font-medium text-brand-on-surface-variant opacity-60 mb-1">Amount (INR)</label>
                      <input
                        type="number"
                        value={settings.codDeliveryAmount}
                        onChange={(e) => setSettings({...settings, codDeliveryAmount: Number(e.target.value)})}
                        className="w-full md:w-1/2 px-3 py-2 bg-brand-surface rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Security */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-surface-normal">
                <h3 className="font-h text-lg font-bold text-brand-on-surface mb-6 flex items-center gap-2">
                  <SettingsIcon size={20} className="text-brand-primary" /> Admin Security
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-brand-on-surface-variant opacity-60 mb-1">Admin Username</label>
                    <input
                      type="text"
                      value={settings.adminUsername}
                      onChange={(e) => setSettings({...settings, adminUsername: e.target.value})}
                      className="w-full px-3 py-2 bg-brand-surface rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-on-surface-variant opacity-60 mb-1">Admin Password</label>
                    <input
                      type="text"
                      value={settings.adminPassword}
                      onChange={(e) => setSettings({...settings, adminPassword: e.target.value})}
                      className="w-full px-3 py-2 bg-brand-surface rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none"
                      placeholder="Leave blank to keep unchanged"
                    />
                    <p className="text-xs mt-1 text-orange-500">Note: Password is shown in plain text for configuration.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-black text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        );
