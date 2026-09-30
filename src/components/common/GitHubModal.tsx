import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import {
  Github,
  Star,
  GitFork,
  BookOpen,
  FolderTree,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Server,
  Layers,
  Code2,
  Download,
  X,
  FileCode,
} from 'lucide-react';

export const GitHubModal: React.FC = () => {
  const { isGitHubModalOpen, setIsGitHubModalOpen, showToast } = useWasteManagement();
  const [activeTab, setActiveTab] = useState<'readme' | 'tree' | 'api' | 'setup'>('readme');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [starred, setStarred] = useState(false);

  if (!isGitHubModalOpen) return null;

  const repoDetails = {
    owner: '2004satyammishra',
    name: 'smart-waste-management-system',
    branch: 'main',
    cloneUrl: 'https://github.com/2004satyammishra/smart-waste-management-system.git',
    stars: starred ? 129 : 128,
    forks: 34,
    license: 'MIT',
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: `${label} copied.`,
    });
    setTimeout(() => setCopiedText(null), 2500);
  };

  const fileTree = [
    { path: 'server.ts', type: 'file', desc: 'Express.js backend with REST endpoints & Vite integration' },
    { path: 'package.json', type: 'file', desc: 'Dependencies, full-stack scripts (dev, build, start)' },
    { path: 'index.html', type: 'file', desc: 'HTML5 entry point with Plus Jakarta Sans typography' },
    { path: 'metadata.json', type: 'file', desc: 'AI Studio applet configuration and capabilities' },
    { path: 'README.md', type: 'file', desc: 'Complete GitHub documentation and setup manual' },
    { path: 'src/', type: 'dir', desc: 'Frontend application source code' },
    { path: '  ├── App.tsx', type: 'file', desc: 'Master router for Citizen, Collector, and Admin personas' },
    { path: '  ├── main.tsx', type: 'file', desc: 'React 19 entry point and root mounting' },
    { path: '  ├── index.css', type: 'file', desc: 'Tailwind CSS v4 styling & typography layers' },
    { path: '  ├── types.ts', type: 'file', desc: 'TypeScript domain definitions for waste management' },
    { path: '  ├── context/', type: 'dir', desc: 'State management & REST API synchronization' },
    { path: '  │   └── WasteManagementContext.tsx', type: 'file', desc: 'Shared reactive store with offline fallback' },
    { path: '  ├── services/', type: 'dir', desc: 'Typed client-side API layer' },
    { path: '  │   └── api.ts', type: 'file', desc: 'Fetch wrappers for all backend /api/* routes' },
    { path: '  ├── data/', type: 'dir', desc: 'Municipal seed records and mock database' },
    { path: '  │   └── mockData.ts', type: 'file', desc: 'Initial complaints, pickups, drivers, articles' },
    { path: '  └── components/', type: 'dir', desc: 'Modular components by user persona' },
    { path: '      ├── citizen/', type: 'dir', desc: 'Citizen mobile application flows' },
    { path: '      │   ├── SplashScreen.tsx', type: 'file', desc: 'Branded eco-city splash with animation' },
    { path: '      │   ├── OnboardingScreen.tsx', type: 'file', desc: '3-step civic onboarding carousel' },
    { path: '      │   ├── AuthScreen.tsx', type: 'file', desc: 'Citizen sign-in & registration' },
    { path: '      │   ├── CitizenHome.tsx', type: 'file', desc: 'Dashboard with Eco-Karma score & actions' },
    { path: '      │   ├── ReportWasteScreen.tsx', type: 'file', desc: 'Geotagged incident reporting with map pin' },
    { path: '      │   ├── ComplaintDetailScreen.tsx', type: 'file', desc: '5-stage visual progress timeline' },
    { path: '      │   ├── RequestPickupScreen.tsx', type: 'file', desc: 'Doorstep e-waste/dry collection booking' },
    { path: '      │   └── AwarenessScreen.tsx', type: 'file', desc: 'Color-coded segregation guide & tips' },
    { path: '      ├── collector/', type: 'dir', desc: 'Waste Collector driver application' },
    { path: '      │   └── CollectorDashboard.tsx', type: 'file', desc: 'Route tasks, GPS navigation & proof upload' },
    { path: '      ├── admin/', type: 'dir', desc: 'Sanitation authority surveillance dashboard' },
    { path: '      │   ├── AdminLayout.tsx', type: 'file', desc: 'Sidebar navigation & responsive frame' },
    { path: '      │   ├── AdminDashboardOverview.tsx', type: 'file', desc: 'KPI cards & SVG trend analytics' },
    { path: '      │   ├── AdminComplaintsTable.tsx', type: 'file', desc: 'Complaint queue & crew dispatching' },
    { path: '      │   ├── AdminPickupsTable.tsx', type: 'file', desc: 'Doorstep pickup fleet scheduling' },
    { path: '      │   ├── AdminHotspotsMap.tsx', type: 'file', desc: 'Geospatial surveillance heat map' },
    { path: '      │   └── AdminAwarenessManager.tsx', type: 'file', desc: 'Educational content CMS editor' },
    { path: '      └── common/', type: 'dir', desc: 'Reusable framework components' },
    { path: '          ├── DeviceFrame.tsx', type: 'file', desc: 'Simulated smartphone chassis' },
    { path: '          ├── HeaderBar.tsx', type: 'file', desc: 'Top persona switcher & GitHub triggers' },
    { path: '          └── GitHubModal.tsx', type: 'file', desc: 'In-app GitHub repository viewer' },
  ];

  const apiEndpoints = [
    { method: 'GET', path: '/api/health', desc: 'Server health check, uptime & environment status' },
    { method: 'GET', path: '/api/stats', desc: 'Executive dashboard KPI metrics and category counts' },
    { method: 'GET', path: '/api/complaints', desc: 'List all citizen complaints with status & category filters' },
    { method: 'POST', path: '/api/complaints', desc: 'Report a new waste issue with geotag, photo & priority' },
    { method: 'PATCH', path: '/api/complaints/:id/status', desc: 'Update complaint status and attach resolution proof' },
    { method: 'POST', path: '/api/complaints/:id/assign', desc: 'Allocate municipal sanitation crew to incident' },
    { method: 'GET', path: '/api/pickups', desc: 'List scheduled doorstep pickups by status/type' },
    { method: 'POST', path: '/api/pickups', desc: 'Book a new doorstep pickup (e-waste, dry, plastic)' },
    { method: 'PATCH', path: '/api/pickups/:id/status', desc: 'Update pickup status (Assigned, Completed)' },
    { method: 'POST', path: '/api/pickups/:id/assign', desc: 'Assign collection van to pickup request' },
    { method: 'GET', path: '/api/collectors', desc: 'List municipal driver roster and vehicles' },
    { method: 'PATCH', path: '/api/collectors/:id/status', desc: 'Update collector duty status (On Route, Available)' },
    { method: 'GET', path: '/api/hotspots', desc: 'Get geospatial waste complaint hotspots & surveillance index' },
    { method: 'POST', path: '/api/hotspots/:id/dispatch', desc: 'Dispatch rapid sanitation squad to area hotspot' },
    { method: 'GET', path: '/api/awareness', desc: 'List waste segregation articles & educational guides' },
    { method: 'POST', path: '/api/awareness', desc: 'Publish new article to waste awareness CMS' },
    { method: 'PUT', path: '/api/awareness/:id', desc: 'Update article content, dos & donts' },
    { method: 'DELETE', path: '/api/awareness/:id', desc: 'Remove article from awareness curriculum' },
    { method: 'GET', path: '/api/notifications', desc: 'List citizen and driver notifications' },
    { method: 'POST', path: '/api/reset', desc: 'Reset all platform records to initial seed data' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-4xl h-[92vh] max-h-[820px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="bg-[#121824] text-white px-5 py-4 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/20">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs font-mono">{repoDetails.owner}</span>
                <span className="text-gray-500 text-xs">/</span>
                <h2 className="text-sm sm:text-base font-bold text-white font-mono tracking-tight">
                  {repoDetails.name}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  public
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">
                Smart Waste Management System · Clean City, Green City
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Star button */}
            <button
              onClick={() => {
                setStarred(!starred);
                showToast({
                  type: 'success',
                  title: !starred ? 'Starred Repository' : 'Unstarred',
                  message: !starred
                    ? 'Thank you for starring the project!'
                    : 'Removed star from repository.',
                });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                starred
                  ? 'bg-amber-400 text-gray-900 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${starred ? 'fill-current' : ''}`} />
              <span>{repoDetails.stars}</span>
            </button>

            {/* Fork button */}
            <button
              onClick={() =>
                copyToClipboard(repoDetails.cloneUrl, 'Clone URL')
              }
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all hidden sm:flex"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>{repoDetails.forks}</span>
            </button>

            {/* Close */}
            <button
              onClick={() => setIsGitHubModalOpen(false)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clone URL Quick Copy Bar */}
        <div className="bg-[#1A2232] px-5 py-2.5 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden text-xs">
            <span className="text-gray-400 font-mono text-[11px] shrink-0">Clone HTTPS:</span>
            <code className="bg-black/40 text-emerald-300 px-2.5 py-1 rounded-lg font-mono text-[11px] truncate select-all">
              git clone {repoDetails.cloneUrl}
            </code>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() =>
                copyToClipboard(
                  `git clone ${repoDetails.cloneUrl}\ncd ${repoDetails.name}\nnpm install\nnpm run dev`,
                  'Quick Setup Script'
                )
              }
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1 transition-colors"
            >
              {copiedText === 'Quick Setup Script' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>Copy Setup Command</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('readme')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'readme'
                ? 'border-[#2E7D32] text-[#2E7D32] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>README & Docs</span>
          </button>

          <button
            onClick={() => setActiveTab('tree')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'tree'
                ? 'border-[#2E7D32] text-[#2E7D32] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Codebase Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-[#2E7D32] text-[#2E7D32] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>REST API Reference (18 Routes)</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'setup'
                ? 'border-[#2E7D32] text-[#2E7D32] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Installation & Docker</span>
          </button>
        </div>

        {/* Tab Body Viewport */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white">
          {/* TAB 1: README */}
          {activeTab === 'readme' && (
            <div className="space-y-6 max-w-3xl mx-auto text-gray-800">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  build: passing
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
                  React 19 + TypeScript
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-300">
                  Express 4 Backend
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300">
                  Tailwind CSS v4
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-300">
                  License: MIT
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Smart Waste Management System
                </h1>
                <p className="text-sm font-semibold text-[#2E7D32] mt-1">
                  “Clean City, Green City” — Civic-Tech Waste Management Platform
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  A modern, production-ready civic technology platform designed to tackle
                  urban sanitation challenges: overflowing dumpsters, roadside debris, missed
                  garbage collections, illegal toxic dumping, and poor waste segregation.
                </p>
              </div>

              {/* Persona Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-emerald-900">1. Citizen Mobile PWA</h4>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Geotagged hazard reporting, 5-stage live status tracker, doorstep e-waste booking,
                    and Eco-Karma rewards.
                  </p>
                </div>
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-blue-900">2. Collector Driver App</h4>
                  <p className="text-[11px] text-blue-700 mt-1">
                    Vehicle assignment dispatch, route task list, turn-by-turn navigation simulation,
                    and completion photo proof upload.
                  </p>
                </div>
                <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-purple-900">3. Admin Control Room</h4>
                  <p className="text-[11px] text-purple-700 mt-1">
                    Geospatial hotspot heat surveillance map, incident queue resolution, driver fleet
                    roster, and awareness CMS.
                  </p>
                </div>
              </div>

              {/* Architecture Diagram */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Full-Stack Architecture
                </h3>
                <pre className="text-[11px] font-mono text-gray-700 bg-white p-3 rounded-xl border border-gray-200 overflow-x-auto">
{`+--------------------------------------------------------------+
|                   Client Personas (React 19)                 |
|  [Citizen Mobile PWA]   [Collector Driver]   [Admin Web Hub] |
+--------------------------------------------------------------+
                                |
                   HTTP / REST API Requests
                                v
+--------------------------------------------------------------+
|            Express.js Server (Node.js / server.ts)           |
|  - /api/complaints   - /api/pickups      - /api/collectors   |
|  - /api/hotspots     - /api/awareness    - /api/stats        |
+--------------------------------------------------------------+
                                |
                     State Store & Persistence
                                v
+--------------------------------------------------------------+
|       In-Memory DB Engine & JSON State Sync (.db_state)       |
+--------------------------------------------------------------+`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: CODEBASE TREE */}
          {activeTab === 'tree' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Repository File Structure</h3>
                <p className="text-xs text-gray-500">
                  Modular separation of backend server, shared state context, and role-based frontend views.
                </p>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 text-xs">
                {fileTree.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 flex items-center justify-between hover:bg-gray-50 font-mono transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileCode
                        className={`w-3.5 h-3.5 ${
                          item.type === 'dir' ? 'text-[#2E7D32]' : 'text-blue-500'
                        }`}
                      />
                      <span className="font-semibold text-gray-800">{item.path}</span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-sans">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REST API REFERENCE */}
          {activeTab === 'api' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">RESTful Backend Endpoints</h3>
                  <p className="text-xs text-gray-500">
                    Express server endpoints mounted under <code>/api/*</code>.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {apiEndpoints.length} Endpoints Active
                </span>
              </div>

              <div className="space-y-2">
                {apiEndpoints.map((ep, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 font-mono">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          ep.method === 'GET'
                            ? 'bg-blue-100 text-blue-800'
                            : ep.method === 'POST'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ep.method === 'PATCH'
                            ? 'bg-purple-100 text-purple-800'
                            : ep.method === 'PUT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-bold text-gray-900">{ep.path}</span>
                    </div>
                    <span className="text-[11px] text-gray-600 font-sans">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETUP & INSTALLATION */}
          {activeTab === 'setup' && (
            <div className="space-y-5 max-w-3xl mx-auto text-gray-800">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Local Development Setup</h3>
                <p className="text-xs text-gray-500">
                  Run the full-stack application on your local workstation in 3 easy steps.
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700">1. Clone the repository:</span>
                <div className="relative">
                  <pre className="bg-gray-900 text-emerald-400 p-3 rounded-xl text-xs font-mono overflow-x-auto">
                    git clone {repoDetails.cloneUrl}
                    {'\n'}cd {repoDetails.name}
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `git clone ${repoDetails.cloneUrl}\ncd ${repoDetails.name}`,
                        'Clone snippet'
                      )
                    }
                    className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700">2. Install dependencies:</span>
                <div className="relative">
                  <pre className="bg-gray-900 text-emerald-400 p-3 rounded-xl text-xs font-mono overflow-x-auto">
                    npm install
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm install', 'npm install')}
                    className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700">
                  3. Start the Express + Vite server:
                </span>
                <div className="relative">
                  <pre className="bg-gray-900 text-emerald-400 p-3 rounded-xl text-xs font-mono overflow-x-auto">
                    npm run dev
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm run dev', 'npm run dev')}
                    className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">
                  The application will be accessible at <code>http://localhost:3000</code>.
                </p>
              </div>

              {/* Docker instructions */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-700">Docker Container Run:</span>
                <div className="relative">
                  <pre className="bg-gray-900 text-emerald-400 p-3 rounded-xl text-xs font-mono overflow-x-auto">
                    docker build -t smart-waste-app .{'\n'}docker run -p 3000:3000 smart-waste-app
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            <span>Open Source Civic Infrastructure · MIT License</span>
          </div>
          <button
            onClick={() => setIsGitHubModalOpen(false)}
            className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close GitHub Hub
          </button>
        </div>
      </div>
    </div>
  );
};
