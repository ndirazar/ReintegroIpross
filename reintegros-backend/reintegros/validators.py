from django.core.exceptions import ValidationError


def cbu_validator(value):

    cbu = value
    if len(cbu) != 22:
        raise ValidationError("El cbu debe tener una longitud de 22 digitos")
    elif not cbu.isdigit():
        raise ValidationError("CBU con formato incorrecto")

    cbu = [int(item) for item in cbu]

    if not validate_bank(cbu) and not validate_account(cbu):
        raise ValidationError("CBU con formato incorrecto")


def validate_bank(cbu):
    check_digit = cbu[7]
    summation = (
        cbu[0] * 7
        + cbu[1] * 1
        + cbu[2] * 3
        + cbu[3] * 9
        + cbu[4] * 7
        + cbu[5] * 1
        + cbu[6] * 3
    )
    last_summation_digit = int(str(summation)[-1])
    difference = 10 - last_summation_digit

    if (
        check_digit != 0
        and difference == check_digit
        or check_digit == 0
        and difference == 10
    ):
        return True
    else:
        return False


def validate_account(cbu):
    check_digit = cbu[21]
    summation = (
        cbu[8] * 3
        + cbu[9] * 9
        + cbu[10] * 7
        + cbu[11] * 1
        + cbu[12] * 3
        + cbu[13] * 9
        + cbu[14] * 7
        + cbu[15] * 1
        + cbu[16] * 3
        + cbu[17] * 9
        + cbu[18] * 7
        + cbu[19] * 1
        + cbu[20] * 3
    )
    last_summation_digit = int(str(summation)[-1])
    difference = 10 - last_summation_digit

    if (
        check_digit != 0
        and difference == check_digit
        or check_digit == 0
        and difference == 10
    ):
        return True
    else:
        return False


def cuit_cuil_validator(value):
    cuit_cuil = value
    if len(cuit_cuil) != 11:
        raise ValidationError("El cuit-cuil debe tener una longitud de 11 caracteres")

    base = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
    aux = 0
    for i in range(10):
        aux += int(cuit_cuil[i]) * base[i]

    aux = 11 - (aux - (int(aux / 11) * 11))

    if aux == 11:
        aux = 0
    if aux == 10:
        aux = 9

    if not aux == int(cuit_cuil[10]):
        raise ValidationError("El cuit-cuil no es valido")


def porcentaje_de_cobertura_validator(value):
    if value > 100:
        raise ValidationError("Valor incorrecto de porcentajeDeCobertura")
