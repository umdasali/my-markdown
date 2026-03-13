import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCopyCode } from '../../src/hooks/useCopyCode'

describe('useCopyCode', () => {
  it('starts with copied=false', () => {
    const { result } = renderHook(() => useCopyCode('test code'))
    expect(result.current.copied).toBe(false)
  })

  it('sets copied=true after calling copy()', async () => {
    const { result } = renderHook(() => useCopyCode('test code'))
    await act(async () => { result.current.copy() })
    expect(result.current.copied).toBe(true)
  })

  it('calls navigator.clipboard.writeText with the text', async () => {
    const writeMock = vi.spyOn(navigator.clipboard, 'writeText')
    const { result } = renderHook(() => useCopyCode('hello world'))
    await act(async () => { result.current.copy() })
    expect(writeMock).toHaveBeenCalledWith('hello world')
  })

  it('resets copied back to false after delay', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCopyCode('text', 100))
    await act(async () => { result.current.copy() })
    expect(result.current.copied).toBe(true)
    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current.copied).toBe(false)
    vi.useRealTimers()
  })
})
