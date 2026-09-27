// Tipos del quiz de entrada. Los valores literales son los IDs conceptuales
// definidos en la especificación y NO deben cambiarse.

export type GoalNow =
  | 'possible_return'
  | 'contact_or_not'
  | 'still_feels'
  | 'worth_waiting'
  | 'wasting_time'
  | 'start_letting_go'
  | 'stop_feeling_this_way';

export type WhoEnded = 'he_ended' | 'user_ended' | 'mutual' | 'unclear';

export type TimeSinceBreakup =
  | 'less_7_days'
  | '1_4_weeks'
  | '1_3_months'
  | '3_6_months'
  | '6_12_months'
  | 'more_1_year';

export type Timing = 'EARLY' | 'RECENT' | 'MEDIUM' | 'LONG';

export type ContactLevel = 'frequent' | 'occasional' | 'very_little' | 'none';

export type ContactInitiator =
  | 'mostly_him'
  | 'both'
  | 'user_more'
  | 'mostly_user'
  /** Asignado automáticamente cuando contact_level === 'none'. */
  | 'no_contact';

export type WithoutUserInitiating =
  | 'he_contacts'
  | 'eventually_appears'
  | 'small_contact'
  | 'only_meet'
  | 'only_sex'
  | 'nothing'
  | 'user_contacts_first'
  /** Asignado automáticamente cuando contact_level === 'none'. */
  | 'not_applicable';

export type ReturnConversation =
  | 'both_want_return'
  | 'misses_no_return'
  | 'doesnt_know'
  | 'asks_for_time'
  | 'doesnt_want_relationship'
  | 'avoids_topic'
  | 'words_actions_conflict'
  | 'never_discussed_return'
  /** Asignado automáticamente cuando contact_level === 'none'. */
  | 'not_talking';

export type RepairActions =
  | 'concrete_sustained'
  | 'some_concrete'
  | 'mostly_words'
  | 'none'
  | 'cause_not_discussed'
  | 'unclear_change';

export type CycleCount = 'never' | 'once' | 'two_three' | 'many';

export type AfterReconnection =
  | 'try_rebuild'
  | 'contact_no_clarity'
  | 'sex_confusion'
  | 'intense_then_cold'
  | 'return_then_breakup'
  /** Asignado automáticamente cuando cycle_count === 'never'. */
  | 'not_applicable';

export type MainPain =
  | 'will_he_return'
  | 'does_he_love_me'
  | 'another_person'
  | 'he_moved_on'
  | 'urge_to_contact'
  | 'appears_disappears'
  | 'wait_or_move'
  | 'know_not_good'
  | 'stuck';

export type ReturnPosition =
  | 'return_now'
  | 'return_with_changes'
  | 'talk_first'
  | 'ambivalent'
  | 'dont_want_return';

export type SafetyOption =
  | 'threatened'
  | 'physical_harm'
  | 'sexual_coercion'
  | 'control_surveillance'
  | 'fear_of_reaction'
  | 'none_of_these';

export type RouteId = 'R0' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5';

export interface QuizAnswers {
  goal_now?: GoalNow;
  who_ended?: WhoEnded;
  time_since_breakup?: TimeSinceBreakup;
  timing?: Timing;
  contact_level?: ContactLevel;
  contact_initiator?: ContactInitiator;
  without_user_initiating?: WithoutUserInitiating;
  return_conversation?: ReturnConversation;
  repair_actions?: RepairActions;
  cycle_count?: CycleCount;
  after_reconnection?: AfterReconnection;
  main_pain?: MainPain;
  return_position?: ReturnPosition;
  safety?: SafetyOption[];
  safety_flag: boolean;
  first_name?: string;
  route?: RouteId;
  case_id: string;
  created_at: string;
  updated_at: string;
}

/** Campos de respuesta única que se contestan con una tarjeta. */
export type SingleChoiceField =
  | 'goal_now'
  | 'who_ended'
  | 'time_since_breakup'
  | 'contact_level'
  | 'contact_initiator'
  | 'without_user_initiating'
  | 'return_conversation'
  | 'repair_actions'
  | 'cycle_count'
  | 'after_reconnection'
  | 'main_pain'
  | 'return_position';

// ---- Preparación para pagos futuros (ePayco todavía no integrado) ----

export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';

export type SubscriptionStatus =
  | 'inactive'
  | 'active'
  | 'cancel_at_period_end'
  | 'past_due'
  | 'canceled';

export type AccessStatus = 'locked' | 'active' | 'expired';

export interface BillingState {
  payment_status: PaymentStatus;
  subscription_status: SubscriptionStatus;
  access_status: AccessStatus;
}

// ---- Pantallas ----

export type QuestionScreenId =
  | 'Q1'
  | 'Q2'
  | 'Q3'
  | 'Q4'
  | 'Q5'
  | 'Q6'
  | 'Q7'
  | 'Q8'
  | 'Q9'
  | 'Q10'
  | 'Q11'
  | 'Q12'
  | 'Q13'
  | 'Q14';

export type TransitionScreenId = 'T1' | 'T2';

export type ScreenId =
  | 'landing'
  | QuestionScreenId
  | TransitionScreenId
  | 'processing'
  | 'result'
  | 'deepen'
  | 'bridge'
  | 'club'
  | 'checkout';

export interface QuizState {
  version: number;
  screen: ScreenId;
  answers: QuizAnswers;
  billing: BillingState;
}
