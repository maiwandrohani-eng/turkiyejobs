import type { AppLocale } from "@/lib/i18n/locale";

export const AUTH_TRANSLATIONS = {
  en: {
    loginEyebrow: "Welcome back",
    loginTitle: "Sign in to TürkiyeJobs.org",
    loginDescription:
      "Sign in with your TürkiyeJobs.org account to open your applicant workspace, employer tools, or administrator console.",
    registerEyebrow: "Join TürkiyeJobs.org",
    registerTitle: "Create your account",
    registerDescription:
      "Choose whether you are applying for opportunities or posting them on behalf of an organization. Administrator accounts are issued separately by the platform team.",
    forgotEyebrow: "Account",
    forgotTitle: "Forgot your password?",
    forgotDescription:
      "Enter your work email. If an account exists and email delivery is configured, you will receive a link to choose a new password.",
    resetEyebrow: "Account",
    resetTitle: "Set a new password",
    resetDescription: "Choose a strong password you have not used elsewhere.",
    email: "Email",
    password: "Password",
    workEmail: "Work email",
    forgotPassword: "Forgot password?",
    signIn: "Sign in",
    signingIn: "Signing in…",
    noAccount: "No account?",
    register: "Register",
    alreadyRegistered: "Already registered?",
    logIn: "Log in",
    backToSignIn: "Back to sign in",
    sendResetLink: "Send reset link",
    sending: "Sending…",
    createAccount: "Create account",
    creatingAccount: "Creating account…",
    resetPasswordUpdated:
      "Your password was updated. Sign in with your new password.",
    signInIntro: "Sign in with the email and password you used at registration.",
    passwordPlaceholder: "Your TürkiyeJobs.org password",
    previewModeHeading: "How do you want to sign in?",
    previewOption: "Preview (no password)",
    previewOptionDesc:
      "Local demo only — email containing admin, org, or anything else for an applicant.",
    databaseOption: "Database account (Neon)",
    databaseOptionDesc:
      "Use the email and password you registered with.",
    registeringAs: "I am registering as",
    individualApplicant: "Individual applicant",
    organizationEmployer: "Organization / employer",
    fullName: "Full name",
    contactPersonName: "Your name (contact person)",
    organizationName: "Organization name",
    orgNameHint:
      "Use the public or legal name of the organization. This appears on every job listing and in the directory—not your personal name.",
    passwordMin: "Password (min 10 characters)",
    newPasswordLabel: "New password (min 10 characters)",
    namePlaceholder: "e.g. Nour El-Din",
    orgPlaceholder: "e.g. Care Türkiye Foundation",
    emailPlaceholder: "you@organization.org",
    confirmPassword: "Confirm password",
    savePassword: "Save new password",
    saving: "Saving…",
    demoForgotUnavailable:
      "Password reset is unavailable in browser-only preview sign-in. Use full sign-in with database accounts to reset by email, or ask your administrator.",
    demoResetUnavailable: "Password reset is unavailable in browser-only preview sign-in.",
    errInvalidEmail: "Please enter a valid email address.",
    errEnterPassword: "Please enter your password.",
    errInvalidCredentials: "Invalid email or password.",
    errSignInFailed: "Sign-in failed. Please try again.",
    errSessionNotReady:
      "Sign-in succeeded but the session was not ready. Try again, or disable strict tracking protection for this site.",
    errRegisterNameEmail:
      "Please enter your name and a valid email.",
    errRegisterOrgContact:
      "Please enter the contact person's name and a valid email.",
    errRegisterOrgName: "Please enter your organization name.",
    errPasswordMin: "Password must be at least 10 characters.",
    errEmailTaken: "That email is already registered. Try logging in.",
    errRegisterFailed: "Registration failed. Check your details and try again.",
    errCreatedSignInFailed: "Account created but sign-in failed. Please log in manually.",
    errCreatedPleaseLogin: "Account created. Please sign in from the login page.",
    errForgotEmail: "Enter the email you used to register.",
    errForgotGeneric: "Something went wrong. Try again later.",
    errResetMissingToken: "Missing reset token. Open the link from your email again.",
    errPasswordsMismatch: "Passwords do not match.",
    errResetFailed: "Reset failed. Request a new link from the forgot-password page.",
    resetLinkInvalidBefore: "This page needs a valid reset link. Check your email or",
    resetLinkInvalidLink: "request a new reset",
    resetLinkInvalidAfter: ".",
    forgotSuccess:
      "If an account exists for that email, you will receive reset instructions shortly.",
  },
  tr: {
    loginEyebrow: "Tekrar hoş geldiniz",
    loginTitle: "TürkiyeJobs.org'a giriş yapın",
    loginDescription:
      "Aday çalışma alanınızı, işveren araçlarınızı veya yönetici konsolunuzu açmak için TürkiyeJobs.org hesabınızla giriş yapın.",
    registerEyebrow: "TürkiyeJobs.org'a katılın",
    registerTitle: "Hesabınızı oluşturun",
    registerDescription:
      "Fırsatlara başvuruyor musunuz yoksa bir kuruluş adına mı ilan veriyorsunuz seçin. Yönetici hesapları platform ekibi tarafından ayrıca verilir.",
    forgotEyebrow: "Hesap",
    forgotTitle: "Şifrenizi mi unuttunuz?",
    forgotDescription:
      "İş e-postanızı girin. Hesap varsa ve e-posta yapılandırıldıysa yeni şifre seçmek için bir bağlantı alırsınız.",
    resetEyebrow: "Hesap",
    resetTitle: "Yeni şifre belirleyin",
    resetDescription: "Başka yerde kullanmadığınız güçlü bir şifre seçin.",
    email: "E-posta",
    password: "Şifre",
    workEmail: "İş e-postası",
    forgotPassword: "Şifremi unuttum",
    signIn: "Giriş yap",
    signingIn: "Giriş yapılıyor…",
    noAccount: "Hesabınız yok mu?",
    register: "Kayıt ol",
    alreadyRegistered: "Zaten kayıtlı mısınız?",
    logIn: "Giriş yap",
    backToSignIn: "Giriş sayfasına dön",
    sendResetLink: "Sıfırlama bağlantısı gönder",
    sending: "Gönderiliyor…",
    createAccount: "Hesap oluştur",
    creatingAccount: "Hesap oluşturuluyor…",
    resetPasswordUpdated:
      "Şifreniz güncellendi. Yeni şifrenizle giriş yapın.",
    signInIntro: "Kayıt olurken kullandığınız e-posta ve şifre ile giriş yapın.",
    passwordPlaceholder: "TürkiyeJobs.org şifreniz",
    previewModeHeading: "Nasıl giriş yapmak istersiniz?",
    previewOption: "Önizleme (şifresiz)",
    previewOptionDesc:
      "Yalnızca yerel demo — admin, org içeren veya diğer e-postalar aday için.",
    databaseOption: "Veritabanı hesabı (Neon)",
    databaseOptionDesc:
      "Kayıt olduğunuz e-posta ve şifreyi kullanın.",
    registeringAs: "Şu rol ile kayıt oluyorum",
    individualApplicant: "Bireysel aday",
    organizationEmployer: "Kuruluş / işveren",
    fullName: "Ad soyad",
    contactPersonName: "Adınız (irtibat kişisi)",
    organizationName: "Kuruluş adı",
    orgNameHint:
      "Kuruluşun kamuya açık veya resmi adını yazın. Her ilanda ve dizinde bu ad görünür—kişisel adınız değil.",
    passwordMin: "Şifre (en az 10 karakter)",
    newPasswordLabel: "Yeni şifre (en az 10 karakter)",
    namePlaceholder: "ör. Ayşe Yılmaz",
    orgPlaceholder: "ör. Care Türkiye Vakfı",
    emailPlaceholder: "siz@kurulus.org",
    confirmPassword: "Şifreyi onayla",
    savePassword: "Yeni şifreyi kaydet",
    saving: "Kaydediliyor…",
    demoForgotUnavailable:
      "Tarayıcı önizleme girişinde şifre sıfırlama kullanılamaz. E-posta ile sıfırlamak için veritabanı hesabıyla giriş yapın.",
    demoResetUnavailable: "Tarayıcı önizleme girişinde şifre sıfırlama kullanılamaz.",
    errInvalidEmail: "Lütfen geçerli bir e-posta adresi girin.",
    errEnterPassword: "Lütfen şifrenizi girin.",
    errInvalidCredentials: "Geçersiz e-posta veya şifre.",
    errSignInFailed: "Giriş başarısız. Lütfen tekrar deneyin.",
    errSessionNotReady:
      "Giriş başarılı ancak oturum hazır değil. Tekrar deneyin veya bu site için izleme korumasını gevşetin.",
    errRegisterNameEmail: "Lütfen adınızı ve geçerli bir e-posta girin.",
    errRegisterOrgContact:
      "Lütfen irtibat kişisinin adını ve geçerli bir e-posta girin.",
    errRegisterOrgName: "Lütfen kuruluş adını girin.",
    errPasswordMin: "Şifre en az 10 karakter olmalıdır.",
    errEmailTaken: "Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.",
    errRegisterFailed: "Kayıt başarısız. Bilgilerinizi kontrol edip tekrar deneyin.",
    errCreatedSignInFailed:
      "Hesap oluşturuldu ancak giriş başarısız. Lütfen manuel olarak giriş yapın.",
    errCreatedPleaseLogin: "Hesap oluşturuldu. Lütfen giriş sayfasından giriş yapın.",
    errForgotEmail: "Kayıt olurken kullandığınız e-postayı girin.",
    errForgotGeneric: "Bir şeyler ters gitti. Daha sonra tekrar deneyin.",
    errResetMissingToken:
      "Sıfırlama jetonu eksik. E-postanızdaki bağlantıyı tekrar açın.",
    errPasswordsMismatch: "Şifreler eşleşmiyor.",
    errResetFailed:
      "Sıfırlama başarısız. Şifremi unuttum sayfasından yeni bağlantı isteyin.",
    resetLinkInvalidBefore: "Bu sayfa geçerli bir sıfırlama bağlantısı gerektirir. E-postanızı kontrol edin veya",
    resetLinkInvalidLink: "yeni sıfırlama isteyin",
    resetLinkInvalidAfter: ".",
    forgotSuccess:
      "Bu e-posta için hesap varsa kısa süre içinde sıfırlama talimatları alacaksınız.",
  },
} as const;

export type AuthTranslationKey = keyof (typeof AUTH_TRANSLATIONS)["en"];

export function authT(locale: AppLocale, key: AuthTranslationKey): string {
  const table = AUTH_TRANSLATIONS[locale];
  const value = table[key];
  if (value !== undefined) return value;
  return AUTH_TRANSLATIONS.en[key] ?? key;
}
