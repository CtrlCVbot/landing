'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  Calculator,
  ClipboardList,
  MapPin,
  ReceiptText,
  Send,
  Truck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { CTA_LINKS } from '@/lib/constants'
import {
  WORKFLOW_STEPS,
  type WorkflowStateTone,
  type WorkflowStepId,
} from '@/lib/landing-workflow'
import { workflowListReveal, workflowStepReveal } from '@/lib/motion'
import { SectionWrapper } from '@/components/shared/section-wrapper'

const ICON_MAP: Record<WorkflowStepId, LucideIcon> = {
  'ai-order': ClipboardList,
  locations: MapPin,
  'dispatch-status': Truck,
  hwamulman: Send,
  settlement: Calculator,
  invoice: ReceiptText,
}

const STATE_TONE_CLASSES: Record<WorkflowStateTone, string> = {
  progress: 'border-sky-500/30 bg-sky-500/10 text-sky-700',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  neutral: 'border-border bg-muted text-muted-foreground',
}

const STATE_DOT_CLASSES: Record<WorkflowStateTone, string> = {
  progress: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  neutral: 'bg-muted-foreground',
}

export function WorkflowManual() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <SectionWrapper
      id="workflow-manual"
      className="scroll-mt-24 lg:scroll-mt-28 lg:py-28"
    >
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="text-sm font-semibold text-accent">업무 흐름</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
            화주와 주선사별 운송 운영을 하나의 흐름으로 조율합니다
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            요청 양식, 배차 방식, 정산 기준, 외부 채널 연동까지 회사별
            운영 방식에 맞춰 정리합니다.
          </p>

          <div className="mt-7 grid gap-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-border bg-card/60 p-4">
              <span className="font-semibold text-foreground">화주 기준</span>
              <p className="mt-1">
                요청 양식과 진행 확인 방식을 운송 오더 흐름에 맞춥니다.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/60 p-4">
              <span className="font-semibold text-foreground">주선사 기준</span>
              <p className="mt-1">
                배차 방식, 전송 필드, 정산 기준을 운영 흐름 안에서
                조율합니다.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={CTA_LINKS.contact.href}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              도입 문의하기
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={CTA_LINKS.service.href}
              target={CTA_LINKS.service.target}
              rel={CTA_LINKS.service.rel}
              className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              OPTIC 바로가기
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  샘플 상태 보드
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  실제 연동 완료 약속이 아니라, 도입 상담에서 맞출 수 있는
                  운영 상태 예시입니다.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <Activity className="h-3.5 w-3.5" aria-hidden="true" />
                Motion-ready mock
              </div>
            </div>
          </div>

          <motion.ol
            variants={shouldReduceMotion ? undefined : workflowListReveal}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={
              shouldReduceMotion ? undefined : { once: true, margin: '-80px' }
            }
            className="grid gap-4"
          >
          {WORKFLOW_STEPS.map((step) => {
            const Icon = ICON_MAP[step.id]

            return (
              <motion.li
                key={step.id}
                variants={shouldReduceMotion ? undefined : workflowStepReveal}
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-accent/40 hover:bg-card/90"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        {String(step.order).padStart(2, '0')}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        {step.statusLabel}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-foreground">
                      {step.handoff}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {step.customization.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 rounded-lg border border-border bg-background/70 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {step.state.summary}
                          </p>
                        </div>
                        <span
                          className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${STATE_TONE_CLASSES[step.state.tone]}`}
                        >
                          {step.state.title}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {step.state.events.map((event) => (
                          <span
                            key={event}
                            className="inline-flex min-w-0 items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground"
                          >
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATE_DOT_CLASSES[step.state.tone]}`}
                              aria-hidden="true"
                            />
                            <span className="min-w-0 break-keep">{event}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            )
          })}
          </motion.ol>
        </div>
      </div>
    </SectionWrapper>
  )
}
