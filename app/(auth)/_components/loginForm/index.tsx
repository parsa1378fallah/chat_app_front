"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { loginService } from "@/services/auth.service";
import { login } from "@/store/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/features/userSlice";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
// 🎯 تعریف ولیدیشن با Zod
const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره باید با 09 شروع شده و 11 رقم باشد"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

// ✅ نوع داده‌ها از روی اسکیمای Zod
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userStore = useAppSelector(selectUser);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginService(data.phone, data.password);
      console.log("Login response:", response);
      dispatch(login(response.data));
      addToast({
        description: "کاربر با موفقیت وارد شد",
        color: "success",
      });
      router.push("/chats");
    } catch (error) {
      console.error("Login error:", error);
      addToast({
        description: "نام کاربری یا رمز عبور اشتباه می باشد",
        color: "danger",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      {`${userStore.phone}`}
      <CardHeader className="text-xl font-bold text-center">
        ورود به حساب
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* فیلد ایمیل */}
          <Input
            {...register("phone")}
            label="شماره تماس"
            placeholder="09119559156"
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}
          />

          {/* فیلد رمز عبور */}
          <Input
            {...register("password")}
            type="password"
            label="رمز عبور"
            placeholder="******"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />

          <Button
            type="submit"
            className="w-full"
            color="primary"
            isLoading={isSubmitting}
          >
            ورود
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
