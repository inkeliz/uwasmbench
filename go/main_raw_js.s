#include "textflag.h"

TEXT ·oomStart(SB), NOSPLIT, $0
  CallImport
  RET

TEXT ·oomTestString(SB), NOSPLIT, $0
  CallImport
  RET

TEXT ·oomTestBytes(SB), NOSPLIT, $0
  CallImport
  RET

TEXT ·oomTestVoid(SB), NOSPLIT, $0
  CallImport
  RET

TEXT ·oomTestVoidMap(SB), NOSPLIT, $0
  CallImport
  RET

TEXT ·oomEnd(SB), NOSPLIT, $0
  CallImport
  RET
