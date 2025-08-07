import { useState } from 'react'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { Phone, PhoneCall } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CallButton({ contact, type = 'lead', onCallComplete }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [callData, setCallData] = useState({
    callType: 'follow_up',
    notes: ''
  })

  const handleCall = async () => {
    if (!contact.phone) {
      toast.error('No phone number available for this contact')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/calling/make-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toNumber: contact.phone,
          leadId: type === 'lead' ? contact.id : null,
          clientId: type === 'client' ? contact.id : null,
          callType: callData.callType,
          notes: callData.notes
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Call initiated successfully!')
        setIsOpen(false)
        if (onCallComplete) {
          onCallComplete(result)
        }
      } else {
        toast.error(result.error || 'Failed to initiate call')
      }
    } catch (error) {
      console.error('Error making call:', error)
      toast.error('Failed to initiate call. Please check your calling service configuration.')
    } finally {
      setIsLoading(false)
    }
  }

  const callTypes = [
    { key: 'new_lead', label: 'New Lead Follow-up' },
    { key: 'follow_up', label: 'General Follow-up' },
    { key: 'renewal', label: 'Policy Renewal' },
    { key: 'commission_follow_up', label: 'Commission Follow-up' }
  ]

  return (
    <>
      <Button
        size="sm"
        color="primary"
        startContent={<Phone size={16} />}
        onPress={() => setIsOpen(true)}
        isDisabled={!contact.phone}
      >
        Call {contact.firstName}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-primary" />
              <span>Make Call</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Calling:</p>
                <p className="font-medium">
                  {contact.firstName} {contact.lastName}
                </p>
                <p className="text-sm text-gray-500">{contact.phone}</p>
                {contact.company && (
                  <p className="text-sm text-gray-500">{contact.company}</p>
                )}
              </div>

              <Select
                label="Call Type"
                value={callData.callType}
                onChange={(e) => setCallData({ ...callData, callType: e.target.value })}
              >
                {callTypes.map((callType) => (
                  <SelectItem key={callType.key} value={callType.key}>
                    {callType.label}
                  </SelectItem>
                ))}
              </Select>

              <Textarea
                label="Call Notes"
                placeholder="Add any notes about this call..."
                value={callData.notes}
                onChange={(e) => setCallData({ ...callData, notes: e.target.value })}
                minRows={3}
              />

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This will initiate an automated call with a professional greeting. 
                  The call will be recorded and logged in your conversation history.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleCall}
              isLoading={isLoading}
              startContent={<PhoneCall size={16} />}
            >
              {isLoading ? 'Initiating Call...' : 'Make Call'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
} 