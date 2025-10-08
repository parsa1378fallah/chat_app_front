"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { registerService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";

// 🎯 ولیدیشن بر اساس جدول یوزرها
const userSchema = z
  .object({
    username: z.string().min(3, "یوزرنیم باید حداقل ۳ کاراکتر باشد"),
    email: z.string().email("ایمیل معتبر نیست"),
    phone: z
      .string()
      .regex(/^09\d{9}$/, "شماره باید با 09 شروع شده و 11 رقم باشد"),
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
    confirmPassword: z.string().min(6, "تایید رمز عبور الزامی است"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "رمز عبور و تایید آن یکسان نیست",
  });

// ✅ نوع داده‌ها
type UserFormData = z.infer<typeof userSchema>;

export default function UserRegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = registerService({ ...data });
      addToast({
        description: "کاربر با موفقیت ثبت نام شد",
        color: "success",
      });
      router.push("/login");
    } catch {
      addToast({
        description: "متاسفانه خطایی پیش آمده لطفا دوباره تلاش کنید",
        color: "danger",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-xl font-bold text-center">
        ثبت‌نام کاربر جدید
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* یوزرنیم */}
          <Input
            {...register("username")}
            label="یوزرنیم"
            placeholder="مثلاً ali_rezaei"
            isInvalid={!!errors.username}
            errorMessage={errors.username?.message}
          />

          {/* ایمیل */}
          <Input
            {...register("email")}
            label="ایمیل"
            placeholder="example@mail.com"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />

          {/* شماره موبایل */}
          <Input
            {...register("phone")}
            label="شماره موبایل"
            placeholder="09123456789"
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}
          />

          {/* رمز عبور */}
          <Input
            {...register("password")}
            type="password"
            label="رمز عبور"
            placeholder="******"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />

          {/* تایید رمز */}
          <Input
            {...register("confirmPassword")}
            type="password"
            label="تایید رمز عبور"
            placeholder="******"
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            className="w-full"
            color="primary"
            isLoading={isSubmitting}
          >
            ثبت‌نام
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
