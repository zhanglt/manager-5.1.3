package com.neu.api

import com.neu.client.RestClient
import com.neu.client.RestClient.baseClusterUri
import com.neu.core.AuthenticationManager
import com.typesafe.scalalogging.LazyLogging
import spray.http.StatusCodes
import spray.routing.{ Directives, StandardRoute }

import java.io.{ PrintWriter, StringWriter }

class BaseService() extends Directives with LazyLogging {
  val authError                  = "身份验证错误!"
  val blocked                    = "由于多次登录失败而暂时冻结账号"
  val authSSODisabledError       = "使用OpenShift的或Rancher的RBAC进行身份验证已被禁用！"
  val passwordExpired            = "密码已过期"
  val timeOutStatus              = "状态码: 408"
  val authenticationFailedStatus = "状态码: 401"

  protected def onExpiredOrInternalError(e: Throwable) = {
    logger.warn(e.getMessage)
    if (e.getMessage.contains(timeOutStatus)) {
      (StatusCodes.RequestTimeout, "Session expired!")
    } else if (e.getMessage.contains(authenticationFailedStatus)) {
      (StatusCodes.Unauthorized, authError)
    } else {
      (StatusCodes.InternalServerError, "Internal server error")
    }
  }

  protected def onNonFatal(e: Throwable) = {
    val sw = new StringWriter
    e.printStackTrace(new PrintWriter(sw))
    logger.warn(sw.toString)
    if (e.getMessage.contains(timeOutStatus) || e.getMessage.contains(
          authenticationFailedStatus
        )) {
      (StatusCodes.RequestTimeout, "Session expired!")
    } else {
      (StatusCodes.InternalServerError, "Internal server error")
    }
  }

  protected def onUnauthorized(e: Throwable): StandardRoute =
    if (e.getMessage.contains("\"code\":47")) {
      complete((StatusCodes.Unauthorized, blocked))
    } else if (e.getMessage.contains("\"code\":48")) {
      complete((StatusCodes.Unauthorized, passwordExpired))
    } else if (e.getMessage.contains("\"code\":50")) {
      complete(StatusCodes.Unauthorized, authSSODisabledError)
    } else {
      complete((StatusCodes.Unauthorized, authError))
    }

  protected def setBaseUrl(tokenId: String, transactionId: String): Unit = {
    val cachedBaseUrl = AuthenticationManager.getBaseUrl(tokenId)
    val baseUrl = cachedBaseUrl.fold(
      baseClusterUri(tokenId, RestClient.reloadCtrlIp(tokenId, 0))
    )(
      cachedBaseUrl => cachedBaseUrl
    )
    AuthenticationManager.setBaseUrl(tokenId, baseUrl)
    logger.info("test baseUrl: {}", baseUrl)
    logger.info("Transaction ID(Post): {}", transactionId)
  }
}
