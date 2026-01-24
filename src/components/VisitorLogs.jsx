import { useState, useEffect } from 'react'
import { fetchVisitorLogs } from '../utils/analytics'
import { X, RefreshCw, Smartphone, Monitor } from 'lucide-react'
import { useEdit } from '../context/EditContext'

export default function VisitorLogs({ isOpen, onClose }) {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const { editPassword } = useEdit()

    const loadLogs = async () => {
        setLoading(true)
        try {
            const data = await fetchVisitorLogs(editPassword)
            setLogs(data.logs || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            loadLogs()
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-white">Visitor Logs</h2>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                            {logs.length} entries
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={loadLogs}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            title="Refresh logs"
                        >
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-auto flex-1 p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#0f172a] z-10">
                            <tr className="border-b border-white/10">
                                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
                                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">IP Address</th>
                                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Device</th>
                                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Page</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        Loading logs...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No visits recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-4 text-sm text-gray-400 whitespace-nowrap font-mono">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-sm text-blue-400 font-mono">
                                            {log.ip}
                                        </td>
                                        <td className="p-4 text-sm text-gray-300">
                                            {log.location}
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                {log.device === 'Mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                                                {log.device}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-300 font-medium">
                                            {log.path}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
