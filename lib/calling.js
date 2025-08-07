// Calling service for the CRM
// Supports multiple calling providers (Twilio, Vonage, etc.)

class CallingService {
  constructor() {
    this.provider = process.env.CALLING_PROVIDER || 'twilio';
    this.config = this.getProviderConfig();
  }

  getProviderConfig() {
    switch (this.provider) {
      case 'twilio':
        return {
          accountSid: process.env.TWILIO_ACCOUNT_SID,
          authToken: process.env.TWILIO_AUTH_TOKEN,
          phoneNumber: process.env.TWILIO_PHONE_NUMBER
        };
      case 'vonage':
        return {
          apiKey: process.env.VONAGE_API_KEY,
          apiSecret: process.env.VONAGE_API_SECRET,
          phoneNumber: process.env.VONAGE_PHONE_NUMBER
        };
      default:
        return {};
    }
  }

  // Make an outbound call
  async makeCall(toNumber, fromNumber = null, options = {}) {
    try {
      switch (this.provider) {
        case 'twilio':
          return await this.makeTwilioCall(toNumber, fromNumber, options);
        case 'vonage':
          return await this.makeVonageCall(toNumber, fromNumber, options);
        default:
          throw new Error(`Unsupported calling provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('Error making call:', error);
      throw error;
    }
  }

  // Twilio implementation
  async makeTwilioCall(toNumber, fromNumber, options) {
    if (!this.config.accountSid || !this.config.authToken) {
      throw new Error('Twilio credentials not configured');
    }

    const client = require('twilio')(this.config.accountSid, this.config.authToken);
    
    const callParams = {
      to: toNumber,
      from: fromNumber || this.config.phoneNumber,
      url: options.webhookUrl || `${process.env.NEXTAUTH_URL}/api/calling/webhook`,
      statusCallback: `${process.env.NEXTAUTH_URL}/api/calling/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
      record: options.record || false,
      timeout: options.timeout || 30
    };

    if (options.script) {
      callParams.twiml = this.generateTwiml(options.script);
    }

    const call = await client.calls.create(callParams);
    
    return {
      callId: call.sid,
      status: call.status,
      provider: 'twilio',
      to: toNumber,
      from: callParams.from,
      direction: 'outbound',
      startTime: call.startTime,
      duration: call.duration
    };
  }

  // Vonage implementation
  async makeVonageCall(toNumber, fromNumber, options) {
    if (!this.config.apiKey || !this.config.apiSecret) {
      throw new Error('Vonage credentials not configured');
    }

    const Vonage = require('@vonage/server-sdk');
    const vonage = new Vonage({
      apiKey: this.config.apiKey,
      apiSecret: this.config.apiSecret
    });

    return new Promise((resolve, reject) => {
      vonage.calls.create({
        to: [{ type: 'phone', number: toNumber }],
        from: { type: 'phone', number: fromNumber || this.config.phoneNumber },
        ncco: this.generateNcco(options.script),
        eventUrl: [`${process.env.NEXTAUTH_URL}/api/calling/webhook`]
      }, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            callId: response.uuid,
            status: 'started',
            provider: 'vonage',
            to: toNumber,
            from: fromNumber || this.config.phoneNumber,
            direction: 'outbound'
          });
        }
      });
    });
  }

  // Generate TwiML for Twilio
  generateTwiml(script) {
    let twiml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    
    if (script && script.greeting) {
      twiml += `<Say voice="alice">${script.greeting}</Say>`;
    }
    
    if (script && script.pause) {
      twiml += `<Pause length="${script.pause}"/>`;
    }
    
    twiml += '</Response>';
    return twiml;
  }

  // Generate NCCO for Vonage
  generateNcco(script) {
    const ncco = [];
    
    if (script && script.greeting) {
      ncco.push({
        action: 'talk',
        text: script.greeting,
        voiceName: 'alice'
      });
    }
    
    if (script && script.pause) {
      ncco.push({
        action: 'pause',
        length: script.pause
      });
    }
    
    return ncco;
  }

  // Get call status
  async getCallStatus(callId) {
    try {
      switch (this.provider) {
        case 'twilio':
          const client = require('twilio')(this.config.accountSid, this.config.authToken);
          const call = await client.calls(callId).fetch();
          return {
            callId: call.sid,
            status: call.status,
            duration: call.duration,
            startTime: call.startTime,
            endTime: call.endTime,
            price: call.price,
            priceUnit: call.priceUnit
          };
        default:
          throw new Error(`Status check not implemented for ${this.provider}`);
      }
    } catch (error) {
      console.error('Error getting call status:', error);
      throw error;
    }
  }

  // Generate calling script based on lead/client data
  generateCallScript(leadOrClient, callType = 'follow_up') {
    const scripts = {
      follow_up: {
        greeting: `Hello, this is calling from Sweetspot Insurance. I'm following up on your recent inquiry about insurance coverage. Is this a good time to talk?`,
        pause: 2
      },
      new_lead: {
        greeting: `Hello, this is calling from Sweetspot Insurance. I received your inquiry about insurance coverage and wanted to discuss your needs. Do you have a few minutes?`,
        pause: 2
      },
      renewal: {
        greeting: `Hello, this is calling from Sweetspot Insurance regarding your policy renewal. I wanted to review your current coverage and discuss any updates. Is this a convenient time?`,
        pause: 2
      },
      commission_follow_up: {
        greeting: `Hello, this is calling from Sweetspot Insurance regarding your recent policy. I wanted to confirm everything is in order and address any questions you might have.`,
        pause: 2
      }
    };

    return scripts[callType] || scripts.follow_up;
  }

  // Schedule a call for later
  async scheduleCall(toNumber, scheduledTime, options = {}) {
    try {
      // For now, we'll just create a task reminder
      // In a full implementation, you'd integrate with a scheduling service
      return {
        scheduledTime,
        toNumber,
        status: 'scheduled',
        reminder: true
      };
    } catch (error) {
      console.error('Error scheduling call:', error);
      throw error;
    }
  }
}

export default CallingService; 