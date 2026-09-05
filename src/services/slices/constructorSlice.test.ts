import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearOrderModal,
  placeOrder,
  initialState
} from './constructorSlice';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

describe('constructorSlice', () => {

  const mockIngredient: TIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 1,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  const mockConstructorIngredient: TConstructorIngredient = {
    ...mockIngredient,
    id: '123'
  };

  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('добавляет булку', () => {
    const state = constructorReducer(initialState, addIngredient(mockIngredient));
    expect(state.bun).toEqual(expect.objectContaining({ _id: '1', type: 'bun' }));
  });

  it('добавляет начинку', () => {
    const ingredient = { ...mockIngredient, type: 'main' };
    const state = constructorReducer(initialState, addIngredient(ingredient));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].type).toBe('main');
  });

  it('удаляет ингредиент', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [mockConstructorIngredient]
    };
    const state = constructorReducer(stateWithIngredient, removeIngredient('123'));
    expect(state.ingredients).toHaveLength(0);
  });

  it('перемещает ингредиент', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...mockConstructorIngredient, id: '1' },
        { ...mockConstructorIngredient, id: '2' }
      ]
    };
    const state = constructorReducer(
      stateWithIngredients,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );
    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
  });

  it('очищает данные заказа', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: { _id: 'order1' } as TOrder
    };
    const state = constructorReducer(stateWithOrder, clearOrderModal());
    expect(state.orderModalData).toBeNull();
  });

  it('обрабатывает placeOrder.pending', () => {
    const action = { type: placeOrder.pending.type };
    const state = constructorReducer(initialState, action);
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает placeOrder.fulfilled', () => {
    const order = { _id: 'order1' } as TOrder;
    const action = { type: placeOrder.fulfilled.type, payload: order };
    const state = constructorReducer(
      { ...initialState, bun: mockIngredient, ingredients: [mockConstructorIngredient] },
      action
    );
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(order);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  it('обрабатывает placeOrder.rejected', () => {
    const action = { type: placeOrder.rejected.type, error: { message: 'Ошибка' } };
    const state = constructorReducer(initialState, action);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});