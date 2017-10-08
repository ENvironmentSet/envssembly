#envssembly

어셈블리어를 닮은 재미있는 언어입니다.

ERun (이-런) 이라 불리는 실행기 위에서 작동합니다.

문법
=============

값의 타입
-------------

모든 메모리와 같은 값을 담고있는 것들은
런-타임에 자신이 담고있는 값의 타입을 따릅니다.

각 타입은 아래와 같습니다

###1.숫자

이 언어에서 모든 숫자는 double-precision 64-bit binary format IEEE 754 입니다.
또한 10진수,16진수,8진수,2진수 표현을 지원합니다.

#### 10진수
<pre><code>
    1234567890
</code></pre>

#### 8진수
숫자 앞에 0을 붙입니다.
<pre><code>
     0755
     0123
</code></pre>


#### 2진수
숫자 앞에 0b을 붙입니다.
<pre><code>
     0b101011
     0b11111
</code></pre>


#### 16진수
숫자 앞에 0x을 붙입니다.
<pre><code>
     0x755
     0xFFA
</code></pre>

###2.문자열

모든 문자열은 "" 에 의해 감싸져 있어야 합니다 .
(그렇지 않으면 ERun 실행기가 식별자로 인식합니다.)

<pre><code>
     "도레미파_!"
</code></pre>

식별자
-------------

식별자는 오로지 영어 알파벳으로만 작성할 수 있습니다.

또한 식별자는 라벨과 변수에게만 달 수 있습니다.

###1.라벨

라벨은

<pre><code>
    [식별자]:
</code></pre>

형식을 띄고 있습니다.

이 부분을 라벨의 시작지점이라 부릅니다.
또한 식별자 옆에 : 뒤에는 공백과 개행을 제외하고 모든 문자의 작성이 금지되어있습니다.
한 라벨의 종료지점은 다른 라벨의 시작지점입니다.

한 라벨은 자신의 공간 (시작점-종료점)에 있는 모든 코드를 내부적으로  담고 있습니다.
또한 이 코드들을 가르키는 포인터를 내부적으로 가지고 있습니다.


###2.변수

변수는 선언할 세그먼트에 따라 선언 방법이 달라집니다.

모든 변수의 값이 null로 초기화되는 .bss 세그먼트에서는 아래와 같이 선언합니다
<pre><code>
    .bss
    variableA
    variableB
</code></pre>

변수의 값을 지정해서 초기화 할 수 있는 .data 세그먼트에서는 아래와 같습니다
 <pre><code>
     .data
     variableA "Hello, world"
     variableB 0xFFAC
 </code></pre>




세그먼트
-------------

세그먼트는 세 가지 종류가 있습니다

변수의 값을 null로 초기화하는 .bss 세그먼트
변수의 값을 지정해서 초기화 할 수 있는 .data세그먼트
메모리에 올라갈 코드를 담은 .code 세그먼트

 <pre><code>
     .data
     variableA "Hello, world"
     variableB 0xFFAC
     .bss
     variableC
     .code

     mov ax,1
     lea bx, variableA
 </code></pre>

 주석
 -------------

 ERun 실행기는 ; 가 앞에 명시된 줄은 무시합니다.


 <pre><code>
     .data
     variableA "Hello, world"
     variableB 0xFFAC
     .bss
     variableC
     .code

     mov ax,1
     ; 주석입니다.
     lea bx, variableA
 </code></pre>