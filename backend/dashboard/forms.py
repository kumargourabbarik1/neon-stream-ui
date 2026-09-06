from django import forms
from django.contrib.auth import get_user_model
from api.models import Genre, PlatformSetting, Title

User = get_user_model()


class DashboardLoginForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            "class": "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500",
            "placeholder": "admin@example.com",
            "autofocus": True,
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            "class": "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500",
            "placeholder": "••••••••",
        })
    )


# ── Shared Tailwind input class ────────────────────────────────────────────────
_INPUT = (
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 "
    "text-sm text-white placeholder-white/40 focus:border-violet-500 "
    "focus:outline-none focus:ring-1 focus:ring-violet-500"
)
_SELECT = (
    "w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 "
    "text-sm text-white focus:border-violet-500 focus:outline-none "
    "focus:ring-1 focus:ring-violet-500"
)
_TEXTAREA = (
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 "
    "text-sm text-white placeholder-white/40 focus:border-violet-500 "
    "focus:outline-none focus:ring-1 focus:ring-violet-500 resize-y"
)
_CHECKBOX = "h-4 w-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500"


class TitleForm(forms.ModelForm):
    class Meta:
        model = Title
        fields = [
            "name", "kind", "year", "rating", "season_count", "status",
            "genres", "studio", "synopsis", "poster_url", "banner_url",
            "trailer_url", "video_url", "trending", "is_published",
        ]
        widgets = {
            "name":        forms.TextInput(attrs={"class": _INPUT}),
            "kind":        forms.Select(attrs={"class": _SELECT}),
            "year":        forms.NumberInput(attrs={"class": _INPUT}),
            "rating":      forms.NumberInput(attrs={"class": _INPUT, "step": "0.1"}),
            "season_count": forms.NumberInput(attrs={"class": _INPUT}),
            "status":      forms.Select(attrs={"class": _SELECT}),
            "genres":      forms.SelectMultiple(attrs={"class": _SELECT, "size": "6"}),
            "studio":      forms.TextInput(attrs={"class": _INPUT}),
            "synopsis":    forms.Textarea(attrs={"class": _TEXTAREA, "rows": 4}),
            "poster_url":  forms.URLInput(attrs={"class": _INPUT}),
            "banner_url":  forms.URLInput(attrs={"class": _INPUT}),
            "trailer_url": forms.URLInput(attrs={"class": _INPUT}),
            "video_url":   forms.URLInput(attrs={"class": _INPUT}),
            "trending":    forms.CheckboxInput(attrs={"class": _CHECKBOX}),
            "is_published": forms.CheckboxInput(attrs={"class": _CHECKBOX}),
        }


class GenreForm(forms.ModelForm):
    class Meta:
        model = Genre
        fields = ["name", "description", "image_url", "is_active"]
        widgets = {
            "name":        forms.TextInput(attrs={"class": _INPUT}),
            "description": forms.Textarea(attrs={"class": _TEXTAREA, "rows": 3}),
            "image_url":   forms.URLInput(attrs={"class": _INPUT}),
            "is_active":   forms.CheckboxInput(attrs={"class": _CHECKBOX}),
        }


class PlatformSettingForm(forms.ModelForm):
    class Meta:
        model = PlatformSetting
        fields = ["key", "value"]
        widgets = {
            "key":   forms.TextInput(attrs={"class": _INPUT}),
            "value": forms.Textarea(attrs={"class": _TEXTAREA, "rows": 3,
                                           "placeholder": '{"example": true}'}),
        }
