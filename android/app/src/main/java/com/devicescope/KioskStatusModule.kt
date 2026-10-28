package com.devicescope

import android.app.ActivityManager
import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Read-only query of Android's Lock Task Mode state.
 * Never starts or stops lock task; it only reports the current state.
 */
class KioskStatusModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = NAME

  @ReactMethod
  fun getLockTaskModeState(promise: Promise) {
    try {
      val activityManager =
        reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager
      if (activityManager == null) {
        promise.resolve("unknown")
        return
      }
      // getLockTaskModeState() exists since API 23; minSdk is 24.
      val state = when (activityManager.lockTaskModeState) {
        ActivityManager.LOCK_TASK_MODE_LOCKED -> "locked"
        ActivityManager.LOCK_TASK_MODE_PINNED -> "pinned"
        ActivityManager.LOCK_TASK_MODE_NONE -> "none"
        else -> "unknown"
      }
      promise.resolve(state)
    } catch (error: Exception) {
      promise.reject("KIOSK_STATUS_ERROR", error.message, error)
    }
  }

  companion object {
    const val NAME = "KioskStatus"
  }
}
