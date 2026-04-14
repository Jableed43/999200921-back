import { useState, useEffect } from 'react'
import {
    Dialog, DialogContent, DialogTitle, Box, Typography,
    CircularProgress, IconButton, Stack, Chip, Divider
} from '@mui/material'
import { Close as CloseIcon, CheckCircle as CheckIcon } from '@mui/icons-material'
import { QRCodeSVG } from 'qrcode.react'

/**
 * Modal que muestra el QR de pago de Mercado Pago.
 * 
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   qrData: string (dato del QR generado por MP)
 *   total: number
 *   ventaId: string
 *   onPaid: () => void (callback cuando se confirma el pago)
 *   consultarPago: (ventaId) => Promise
 */
const QRPaymentModal = ({ open, onClose, qrData, total, ventaId, consultarPago }) => {
    const [status, setStatus] = useState('pending')
    const [polling, setPolling] = useState(true)

    // Poll cada 5 segundos para verificar si el pago se completó
    useEffect(() => {
        if (!open || !ventaId || !polling) return

        const interval = setInterval(async () => {
            if (consultarPago) {
                const result = await consultarPago(ventaId)
                if (result && (result.status === 'processed' || result.status === 'paid')) {
                    setStatus('paid')
                    setPolling(false)
                }
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [open, ventaId, polling, consultarPago])

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setStatus('pending')
            setPolling(true)
        }
    }, [open])

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#111',
                    border: '1px solid #333',
                    borderRadius: 4,
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    💳 Pago con Mercado Pago
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider sx={{ borderColor: '#333' }} />

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                {status === 'paid' ? (
                    /* === PAGADO === */
                    <Box sx={{ textAlign: 'center' }}>
                        <CheckIcon sx={{ fontSize: 100, color: '#4caf50', mb: 2 }} />
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#4caf50', mb: 1 }}>
                            ¡Pago Confirmado!
                        </Typography>
                        <Typography color="text.secondary">
                            El pago fue procesado exitosamente.
                        </Typography>
                    </Box>
                ) : qrData ? (
                    /* === QR GENERADO === */
                    <>
                        <Box sx={{
                            bgcolor: 'white',
                            p: 3,
                            borderRadius: 4,
                            mb: 3,
                            boxShadow: '0 0 40px rgba(235, 141, 41, 0.2)'
                        }}>
                            <QRCodeSVG
                                value={qrData}
                                size={260}
                                level="H"
                                includeMargin={false}
                                bgColor="#ffffff"
                                fgColor="#000000"
                            />
                        </Box>

                        <Stack spacing={2} alignItems="center">
                            <Chip
                                label={`Total: $${total?.toLocaleString()}`}
                                sx={{ fontSize: 20, fontWeight: 900, py: 3, px: 2, bgcolor: '#EB8D29', color: 'white' }}
                            />

                            <Stack direction="row" spacing={1} alignItems="center">
                                <CircularProgress size={16} sx={{ color: '#EB8D29' }} />
                                <Typography variant="body2" sx={{ color: '#aaa' }}>
                                    Esperando pago...
                                </Typography>
                            </Stack>

                            <Typography variant="caption" sx={{ color: '#666', textAlign: 'center', maxWidth: 300 }}>
                                Escaneá el código QR con la app de Mercado Pago para completar el pago.
                            </Typography>
                        </Stack>
                    </>
                ) : (
                    /* === CARGANDO === */
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress size={48} sx={{ color: '#EB8D29', mb: 2 }} />
                        <Typography>Generando código QR...</Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default QRPaymentModal
