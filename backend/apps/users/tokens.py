from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class HirelixTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['full_name'] = user.get_full_name()
        token['email'] = user.email
        return token

    def validate(self, attrs):
        # Allow login with email instead of username
        from django.contrib.auth import authenticate
        from rest_framework import exceptions

        email = attrs.get('username')  # simplejwt uses 'username' field
        password = attrs.get('password')

        try:
            from apps.users.models import User
            user_obj = User.objects.get(email=email)
            attrs['username'] = user_obj.username
        except Exception:
            pass

        return super().validate(attrs)


class HirelixTokenObtainPairView(TokenObtainPairView):
    serializer_class = HirelixTokenObtainPairSerializer
