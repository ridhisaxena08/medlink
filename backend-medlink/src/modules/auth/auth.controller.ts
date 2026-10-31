import { created, ok } from '../../shared/utils/apiResponse';
import { asyncHandler, authedHandler } from '../../shared/utils/asyncHandler';
import * as authService from './auth.service';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body, req);
  return created(res, result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, req);
  return ok(res, result);
});

export const refresh = asyncHandler(async (req, res) => {
  const tokens = await authService.refresh(req.body.refreshToken, req);
  return ok(res, { tokens });
});

export const logout = authedHandler(async (req, res) => {
  await authService.logout(req.user.id, req.body?.refreshToken, req.body?.allDevices === true);
  return ok(res, { message: 'Logged out' });
});

export const changePassword = authedHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  return ok(res, { message: 'Password updated. Please sign in again.' });
});
