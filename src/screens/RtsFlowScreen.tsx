import { ShopeeHeader } from '@/components/ShopeeHeader';
import { formatTHB } from '@/lib/format';
import type { Order, R4rDecision, R4rVerification, Screen } from '@/types';
import { AlertTriangle, CheckCircle2, ChevronRight, Clock3, LockKeyhole, PackageCheck, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

interface RtsFlowScreenProps {
  order: Order;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onUpdateOrder: (patch: Partial<Order>) => void;
}

const timeline = [
  { title: 'Delivery unsuccessful', text: 'The failed attempt is recorded and relevant parties are notified.' },
  { title: 'Parcel under verification', text: 'Identity, condition, and custody must be checked before disposition changes.' },
  { title: 'Seller options available', text: 'Only choices eligible for this parcel are shown.' },
  { title: 'Resolution in progress', text: 'The selected reattempt, resale, or return pathway is tracked.' },
  { title: 'Case closed', text: 'The final parcel and transaction outcome is recorded.' },
];

const verificationLabels: Record<R4rVerification, string> = {
  PENDING: 'Verification pending', VERIFIED_CHANGE_OF_MIND: 'Verified · intact change-of-mind',
  VERIFIED_BUYER_WILLING: 'Verified · buyer willing to receive', DISCREPANCY: 'Discrepancy under investigation',
  SUSPECTED_TAMPERING: 'Suspected tampering · restricted', DAMAGED_INELIGIBLE: 'Damaged or ineligible',
};

export function RtsFlowScreen({ order, onBack, onUpdateOrder }: RtsFlowScreenProps) {
  const verification = order.r4r_verification ?? 'PENDING';
  const decision = order.r4r_decision ?? '';
  const resolved = Boolean(decision) && order.rts_stage === 'DEFECTIVE_RESOLUTION_SUCCESS';
  const optionStage = ['SELLER_CONTROL_PANEL', 'LOCAL_FLASH_DEALS', 'RESCUE_SALE_DISCOUNT'].includes(order.rts_stage);
  const stageIndex = resolved ? 4 : decision ? 3 : optionStage && verification !== 'PENDING' ? 2 : verification === 'PENDING' ? 1 : 2;
  const canResellOrReturn = verification === 'VERIFIED_CHANGE_OF_MIND';
  const canReturn = canResellOrReturn || verification === 'DAMAGED_INELIGIBLE';
  const canReattempt = verification === 'VERIFIED_BUYER_WILLING' && order.r4r_buyer_willing;
  const blocked = ['DISCREPANCY', 'SUSPECTED_TAMPERING', 'DAMAGED_INELIGIBLE'].includes(verification);

  const choose = (value: R4rDecision) => onUpdateOrder({ r4r_decision: value, rts_stage: 'SELLER_CONTROL_PANEL' });
  const closeCase = () => onUpdateOrder({ rts_stage: 'DEFECTIVE_RESOLUTION_SUCCESS' });
  const decisionText: Record<Exclude<R4rDecision, ''>, string> = {
    REATTEMPT: 'Reattempt or reschedule', LOCAL_RESALE: 'Seller approved local resale', RETURN: 'Return to seller',
  };

  return <>
    <ShopeeHeader title="R4R · Ready for Resale / Return" showBack onBack={onBack} />
    <div className="flex-1 overflow-y-auto bg-shopee-gray pb-6">
      <div className="bg-white px-4 py-3 flex gap-3 items-center">
        <div className="w-12 h-12 rounded-sm overflow-hidden bg-neutral-100 shrink-0"><img src={order.product_image} alt="" className="w-full h-full object-cover" /></div>
        <div className="flex-1 min-w-0"><p className="text-sm text-shopee-text-primary line-clamp-1">{order.product_name}</p><p className="text-xs text-shopee-text-secondary mt-0.5">{order.order_id} · {formatTHB(order.price * order.quantity)}</p></div>
      </div>

      <section className="mx-3 mt-3 rounded-lg bg-white p-4">
        <p className="text-xl font-bold leading-tight text-shopee-text-primary">When delivery fails, seller options shouldn’t.</p>
        <p className="text-sm leading-relaxed text-shopee-text-secondary mt-2">R4R transforms the post-failure journey from an ambiguous return process into a structured, verified pathway for reattempt, eligible resale, or return.</p>
        <div className="mt-3 rounded-md bg-neutral-50 p-2.5 text-xs text-shopee-text-secondary">Concept prototype · illustrative parcel and statuses only. R2D preserves the possibility of successful delivery; R4R preserves the possibility of value recovery.</div>
      </section>

      <section className="mx-3 mt-3 rounded-lg bg-white p-3">
        <div className="flex items-center gap-2"><AlertTriangle size={17} color="#D0011B"/><p className="text-sm font-semibold text-shopee-text-primary">Delivery attempt unsuccessful</p></div>
        <p className="text-xs text-shopee-text-secondary mt-1">Failure recorded{order.failure_reason ? ` · ${order.failure_reason}` : ''}. This does not verify parcel identity, condition, or custody.</p>
      </section>

      <section className="mx-3 mt-3 rounded-lg bg-white p-3">
        <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-shopee-text-primary">Parcel verification</p><span className={`text-[10px] rounded-full px-2 py-1 font-medium ${blocked ? 'bg-red-50 text-red-700' : verification === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{verificationLabels[verification]}</span></div>
        <p className="text-xs text-shopee-text-secondary mt-2">Disposition stays locked until identity, condition, and custody have sufficient confidence.</p>
        {blocked && <div className="flex gap-2 mt-3 rounded-md bg-red-50 p-2.5"><LockKeyhole size={16} color="#D0011B"/><p className="text-xs leading-relaxed text-red-800">{verification === 'DISCREPANCY' ? 'Identity or custody discrepancy: parcel is held during investigation.' : verification === 'SUSPECTED_TAMPERING' ? 'Suspected tampering or substitution: disposition is restricted pending review.' : 'Damage or ineligibility: route through the appropriate return or claims path.'}</p></div>}
        {verification === 'PENDING' && <div className="mt-3 flex gap-2 rounded-md bg-amber-50 p-2.5"><Clock3 size={16} color="#A66A00"/><p className="text-xs text-amber-900">Under verification. Reattempt, resale, return, and reassignment are unavailable while checks are pending.</p></div>}
        {canResellOrReturn && <p className="mt-2 text-xs text-emerald-700">Verified intact and eligible. Resale still requires your approval; return remains available.</p>}
        {canReattempt && <p className="mt-2 text-xs text-emerald-700">The original transaction remains viable and the buyer can receive the parcel.</p>}
      </section>

      <section className="mx-3 mt-3 rounded-lg bg-white overflow-hidden">
        <div className="px-3 py-2.5 border-b border-neutral-100"><p className="text-sm font-semibold text-shopee-text-primary">R4R parcel journey</p></div>
        {timeline.map((step, i) => {
          const done = i < stageIndex || resolved;
          const current = i === stageIndex && !resolved;
          return <div key={step.title} className={`flex gap-3 px-3 py-3 ${current ? 'bg-[#FFF7F0]' : ''}`}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: done ? 'rgba(38,170,153,.15)' : current ? 'rgba(238,77,45,.12)' : '#F5F5F5' }}>{done ? <CheckCircle2 size={16} color="#26AA99"/> : i === 1 ? <ShieldCheck size={16} color={current ? '#EE4D2D' : '#999'}/> : <PackageCheck size={16} color={current ? '#EE4D2D' : '#999'}/>}</div>
            <div><p className={`text-sm font-medium ${done ? 'text-[#26AA99]' : current ? 'text-shopee-orange' : 'text-shopee-text-primary'}`}>{step.title}</p><p className="text-xs text-shopee-text-secondary mt-1">{step.text}</p></div>
          </div>;
        })}
      </section>

      <section className="mx-3 mt-3 rounded-lg bg-white p-3">
        <p className="text-sm font-semibold text-shopee-text-primary">Your available decision</p>
        <p className="text-xs text-shopee-text-secondary mt-1">Estimated resolution timing is not modeled in this demo.</p>
        <div className="mt-3 space-y-2">
          <Choice title="Reattempt or reschedule" text="Keeps the original transaction if the buyer can still receive the parcel." enabled={canReattempt} reason={verification === 'PENDING' ? 'Unavailable: verification is pending.' : verification === 'VERIFIED_BUYER_WILLING' ? 'Unavailable: buyer willingness has not been confirmed.' : 'Unavailable: this verified outcome does not support reattempt.'} selected={decision === 'REATTEMPT'} onClick={() => choose('REATTEMPT')} />
          <Choice title="Approve local resale" text="Only for a verified, intact, eligible change-of-mind item. Requires your approval; a new sale is not guaranteed." enabled={canResellOrReturn} reason={verification === 'PENDING' ? 'Unavailable: verification is pending.' : 'Unavailable: this parcel is not verified as an eligible intact change-of-mind item.'} selected={decision === 'LOCAL_RESALE'} onClick={() => choose('LOCAL_RESALE')} />
          <Choice title="Return or claims path" text="Returns the item; the original sale is not preserved. Damaged or ineligible items go through the appropriate return or claims handling." enabled={canReturn} reason={verification === 'PENDING' ? 'Unavailable: verification is pending.' : blocked ? 'Unavailable: a hold or review blocks disposition.' : 'Unavailable: return requires a verified parcel outcome.'} selected={decision === 'RETURN'} onClick={() => choose('RETURN')} />
        </div>
        {decision && <button
          onClick={resolved ? undefined : closeCase}
          disabled={resolved}
          aria-live="polite"
          className={`mt-3 w-full rounded-md py-2.5 text-sm font-medium flex justify-center items-center gap-1 ${resolved ? 'bg-emerald-600 text-white cursor-default' : 'shopee-cta'}`}
        >
          {resolved ? `Demo resolution complete · ${decisionText[decision as Exclude<R4rDecision, ''>]}` : <>Mark demo resolution complete <ChevronRight size={15}/></>}
        </button>}
        {blocked && <p className="text-xs text-shopee-text-secondary mt-3">Next step: hold for investigation or route to the appropriate claims and return review. No disposition can be selected here.</p>}
      </section>

      {resolved && <div className="mx-3 mt-3 rounded-lg bg-emerald-50 p-3"><p className="text-sm font-semibold text-emerald-800">Case closed · {decisionText[decision as Exclude<R4rDecision, ''>]}</p><p className="text-xs text-emerald-700 mt-1">Illustrative demo outcome recorded for this parcel.</p></div>}
      <div className="mx-3 mt-3 rounded-lg bg-white p-3 flex gap-2"><RotateCcw size={16} color="#26AA99"/><p className="text-xs text-shopee-text-secondary">Managed optionality with parcel visibility and accountability across the continuous R2D → R4R journey.</p><Truck size={16} color="#26AA99"/></div>
    </div>
  </>;
}

function Choice({ title, text, enabled, reason, selected, onClick }: { title: string; text: string; enabled: boolean; reason: string; selected: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} disabled={!enabled} aria-pressed={selected} className={`w-full rounded-lg border p-3 text-left ${enabled ? 'active:bg-neutral-50' : 'bg-neutral-50 opacity-75'}`} style={{ borderColor: selected ? '#EE4D2D' : '#E5E5E5' }}>
    <span className="flex items-center justify-between gap-2"><span className="text-sm font-medium text-shopee-text-primary">{title}</span>{enabled ? <ChevronRight size={15} color="#EE4D2D"/> : <LockKeyhole size={14} color="#999"/>}</span>
    <span className="block text-xs text-shopee-text-secondary mt-1">{text}</span>
    {!enabled && <span className="block text-[11px] text-amber-800 mt-1">{reason}</span>}
  </button>;
}
