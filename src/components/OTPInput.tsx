import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const OTPInput = ({ value, onChange, disabled }: OTPInputProps) => {
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <InputOTPGroup className="gap-2">
        <InputOTPSlot index={0} className="w-12 h-12 text-lg border-border bg-input" />
        <InputOTPSlot index={1} className="w-12 h-12 text-lg border-border bg-input" />
        <InputOTPSlot index={2} className="w-12 h-12 text-lg border-border bg-input" />
        <InputOTPSlot index={3} className="w-12 h-12 text-lg border-border bg-input" />
        <InputOTPSlot index={4} className="w-12 h-12 text-lg border-border bg-input" />
        <InputOTPSlot index={5} className="w-12 h-12 text-lg border-border bg-input" />
      </InputOTPGroup>
    </InputOTP>
  );
};
